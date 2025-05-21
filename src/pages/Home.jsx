import Footer from "../ui/Footer";
import Header from "../ui/Header";
import HeroSection from "../ui/HeroSection";

function Home() {
  return (
    <div className='min-h-screen flex flex-col justify-between '>
      <div>
        <Header />
        <video
          autoPlay={true}
          loop={true}
          muted
          className='w-full'
        >
          <source
            src='/Engineering.mp4'
            type='video/mp4'
          />
        </video>
      </div>
      <HeroSection />
      <Footer />
    </div>
  );
}

export default Home;
