function HeroSection() {
  return (
    <div className='h-full'>
      <section className='py-10'>
        <div className='text-center'>
          <h1 className='text-3xl sm:text-4xl font-semibold'>
            Welcome to Murshedi
          </h1>
          <p className='text-sm'>AI Chatbot for Engineering Faculty</p>
        </div>
        <p className='px-10 md:px-28 text-justify mt-10 text-sm sm:text-xl'>
          This project was developed as an innovative initiative aimed at
          enhancing the academic experience within the School of Engineering by
          harnessing the power of artificial intelligence. It introduces an
          AI-driven Retrieval-Augmented Generation (RAG) framework to provide
          accurate and immediate responses to student and faculty inquiries.
          Designed to keep pace with global technological advancements, the
          system supports both text and voice interaction, ensuring
          accessibility and ease of use for all users. With its dynamic
          knowledge base updated regularly by department heads and secure user
          management, the chatbot reflects a forward-thinking approach in line
          with the School’s commitment to academic excellence, digital
          transformation, and service to the local and global community.
        </p>
      </section>
    </div>
  );
}

export default HeroSection;
