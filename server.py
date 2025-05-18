from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import time
import os
from openai import OpenAI
import re
import io

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key="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")
ASSISTANT_ID = "asst_1GORjnI6QmuaZOBIqQEKUela"

responses = {}
threads = {}
# Clean up the output text
def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'【.*?】', '', text)  # Remove text within 【】 brackets
    text = text.replace('*', '')        # Remove asterisks
    text = text.replace('#', '')        # Remove hash symbols
    return text

# Function to generate audio using OpenAI and store it
def process_audio(response_id):
    text_answer = responses[response_id]['answer']
    print("audio")
    # Generate speech from text
    audio_response = client.audio.speech.create(
        model="tts-1",
        # model="gpt-4o-mini-tts",
        voice="onyx",
        # voice="coral",
        input=text_answer,
    )
    
    audio_file_path = f"output_{response_id}.mp3"
    
    # Save the audio to a file
    with open(audio_file_path, "wb") as f:
        f.write(audio_response.content)

    # Store the path in the responses dictionary
    responses[response_id]['audio_file'] = audio_file_path

# Endpoint to handle user questions
@app.route('/ask', methods=['POST'])
def ask():
    user_question = request.json.get('question')
    blind_mode = request.json.get('blind_mode', False)
    thread_id = request.json.get('thread_id')  # <== Get thread_id from frontend

    if not user_question:
        return jsonify({'error': 'No question provided'}), 400

    print(f"User Question: {user_question}")
    print(f"Blind Mode: {blind_mode}")
    print(f"Thread ID: {thread_id}")

    # Create a new thread only if none was provided
    if not thread_id:
        thread = client.beta.threads.create(messages=[{"role": "user", "content": user_question}])
        thread_id = thread.id
    else:
        client.beta.threads.messages.create(thread_id=thread_id, role="user", content=user_question)

    run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=ASSISTANT_ID)

    while run.status != "completed":
        print(f"Run Status: {run.status}")
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

    # Retrieve the generated message
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    new_message = messages.data[0].content[0].text.value
    new_message = clean_text(new_message)

    print(f"Generated Answer: {new_message}")

    response_id = str(time.time())

    responses[response_id] = {
        'answer': new_message,
        'audio_file': None
    }

    if blind_mode:
        process_audio(response_id)
        while 'audio_file' not in responses[response_id] or not responses[response_id]['audio_file']:
            time.sleep(0.5)

        return jsonify({
            'answer': new_message,
            'response_id': response_id,
            'audio_file': f"/audio/{responses[response_id]['audio_file']}",
            'thread_id': thread_id  # return it so frontend can reuse
        })
    else:
        return jsonify({
            'answer': new_message,
            'response_id': response_id,
            'thread_id': thread_id  # return it so frontend can reuse
        })

# New route to upload files to the assistant
@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the files part
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400
    
    files = request.files.getlist('files[]')
    
    # Check if any files were selected
    if not files or all(file.filename == '' for file in files):
        return jsonify({'error': 'No files selected'}), 400
    
    try:
        # 1. First get the current vector_store_id from the assistant
        my_assistant = client.beta.assistants.retrieve(ASSISTANT_ID)
        
        # Extract the current vector store ID
        current_vector_store_ids = []
        if (hasattr(my_assistant, 'tool_resources') and 
            my_assistant.tool_resources and 
            hasattr(my_assistant.tool_resources, 'file_search') and
            my_assistant.tool_resources.file_search and
            hasattr(my_assistant.tool_resources.file_search, 'vector_store_ids')):
            current_vector_store_ids = my_assistant.tool_resources.file_search.vector_store_ids
        
        current_vector_store_id = current_vector_store_ids[0] if current_vector_store_ids else None
        
        # 2. Upload all files to OpenAI
        uploaded_file_ids = []
        uploaded_filenames = []
        
        for file in files:
            if file.filename != '':
                file_content = file.read()
                file_io = io.BytesIO(file_content)
                file_io.name = file.filename
                
                uploaded_file = client.files.create(
                    file=file_io,
                    purpose="assistants"
                )
                
                uploaded_file_ids.append(uploaded_file.id)
                uploaded_filenames.append(file.filename)
        
        # Get all existing files if we have a current vector store
        all_file_ids = []
        if current_vector_store_id:
            try:
                vector_store_files = client.beta.vector_stores.files.list(
                    vector_store_id=current_vector_store_id
                )
                # Extract existing file IDs
                all_file_ids = [file.id for file in vector_store_files.data]
            except Exception as e:
                print(f"Error retrieving files from current vector store: {str(e)}")
        
        # Add the new file IDs to the list
        all_file_ids.extend(uploaded_file_ids)
        
        # 3. Create a new vector store that holds the previous + the new files
        new_vector_store = client.beta.vector_stores.create(
            file_ids=all_file_ids
        )
        
        new_vector_store_id = new_vector_store.id
        
        # 4. Attach the new vector_store_id to the assistant
        assistant = client.beta.assistants.update(
            assistant_id=ASSISTANT_ID,
            tool_resources={
                "file_search": {
                    "vector_store_ids": [new_vector_store_id]
                }
            }
        )
        
        return jsonify({
            'message': f'{len(uploaded_file_ids)} files uploaded successfully',
            'uploaded_file_ids': uploaded_file_ids,
            'uploaded_filenames': uploaded_filenames,
            'previous_vector_store_id': current_vector_store_id,
            'new_vector_store_id': new_vector_store_id,
            'assistant_updated': True,
            'total_files': len(all_file_ids)
        })
        
    except Exception as e:
        # If there's an error anywhere in the process
        print(f"Error processing file uploads: {str(e)}")
        return jsonify({
            'error': f'Error processing file uploads: {str(e)}'
        }), 500

# Endpoint to retrieve the response
@app.route('/get_response/<response_id>', methods=['GET'])
def get_response(response_id):
    if response_id not in responses:
        return jsonify({'error': 'Invalid response ID'}), 404
    
    # If audio is still being processed, return a status update
    if 'audio_file' not in responses[response_id] or not responses[response_id]['audio_file']:
        return jsonify({
            'answer': responses[response_id]['answer'],
            'status': 'Processing audio'
        }), 202
    
    # Return the response along with the audio file path
    return jsonify({
        'answer': responses[response_id]['answer'],
        'audio_file': f"/audio/{responses[response_id]['audio_file']}"
    })

# Endpoint to stream audio directly from the server
@app.route('/audio/<filename>', methods=['GET'])
def stream_audio(filename):
    file_path = os.path.join(os.getcwd(), filename)
    
    if os.path.exists(file_path):
        # Return the audio file for direct playback (not download)
        return send_file(file_path, mimetype='audio/mpeg')
    
    return jsonify({'error': 'Audio file not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)