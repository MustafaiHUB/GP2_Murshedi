export default function DataDisclosure() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Transparency Notice
        </h1>
        <p className='text-gray-700 mb-4'>
          This platform uses an AI Assistant powered by{" "}
          <strong>OpenAI’s Assistant API</strong> as part of a{" "}
          <strong>Retrieval-Augmented Generation (RAG)</strong> system. When you
          interact with the assistant:
        </p>

        <ul className='list-disc list-inside text-gray-700 mb-4 space-y-2'>
          <li>Your messages are sent to OpenAI’s servers for processing.</li>
          <li>OpenAI do not use your data for training their models.</li>
          {/* <li>
            OpenAI may store these messages for monitoring, abuse prevention,
            and model improvement.
          </li> */}
          {/* we do not use your business data for training our models. */}
          <li>
            We store your inputs and outputs in our own secure database for
            analysis, improvement, and record-keeping purposes.
          </li>
        </ul>

        {/* <p className='text-gray-700 mb-4'>
          For more information on how OpenAI handles your data, please visit
          their{" "}
          <a
            href='https://openai.com/policies/api-data-usage-policies'
            className='text-blue-600 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            API Data Usage Policy
          </a>
          .
        </p> */}

        <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded'>
          <p className='font-medium'>
            By continuing, you acknowledge and accept this data policy.
          </p>
        </div>
        {/* 
        <button className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-200'>
          I Understand and Agree
        </button> */}
      </div>
    </div>
  );
}
