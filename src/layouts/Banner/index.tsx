import firstBanner from '../../assets/images/gochu-banner-1.jpg';
import soju from '../../assets/icons/soju.svg';
import uden from '../../assets/icons/ude.svg';
import chicken from '../../assets/icons/chicken.svg';
import chicken1 from '../../assets/icons/chicken-ketchup.svg';
import chicken2 from '../../assets/icons/package-chicken.svg';
import { useCallStore } from '../../contexts/call.store';
import { Carousel } from 'flowbite-react';

const Banner = () => {
  const { participant } = useCallStore();

  return (
    <section className=" h-[32rem]  sm:h-[50rem] lg:h-[30rem] bg-macDonald w-full grid grid-cols-1 lg:grid-cols-6 ">
      <div className="col-span-3 grid   p-4 lg:p-10 w-full ">
        <span className="text-[2rem] sm:text-[3rem] text-center lg:text-start md:text-[4rem] lg:text-[5rem] uppercase leading-tight text-gray-800">
          We invite you to our restaurant
        </span>
        <span className="text-white line-clamp-2 content-center  h-16 text-center lg:text-start text-sm sm:text-lg md:text-xl lg:text-2xl">
          {participant?.branch.description}
        </span>
      </div>
      <div className="col-span-3 place-self-center w-full justify-items-center bg-macDonald mb-10 sm:pb-0  ">
        <div className="w-96  h-80 relative">
          <Carousel indicators={false} rightControl={<div></div>} leftControl={<div></div>}>
            {participant?.branch.images.map((banner, index) => (
              <img key={index} className="  rounded-3xl bg-auto bg-no-repeat bg-center	" src={banner} alt="banner " />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Banner;
