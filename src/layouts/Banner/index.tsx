import firstBanner from '../../assets/images/gochu-banner-1.jpg';
import soju from '../../assets/icons/soju.svg';
import uden from '../../assets/icons/ude.svg';
import chicken from '../../assets/icons/chicken.svg';
import chicken1 from '../../assets/icons/chicken-ketchup.svg';
import chicken2 from '../../assets/icons/package-chicken.svg';

const Banner = () => {
  return (
    <section className=" h-[32rem]  sm:h-[50rem] lg:h-[30rem] bg-macDonald w-full grid grid-cols-1 lg:grid-cols-6 ">
      <div className="col-span-3 grid   p-4 lg:p-10 w-full ">
        <span className="text-[2rem] sm:text-[3rem] text-center lg:text-start md:text-[4rem] lg:text-[5rem] uppercase leading-tight text-gray-800">
          We invite you to our restaurant
        </span>
        <span className="text-white  text-center lg:text-start text-sm sm:text-lg md:text-xl lg:text-2xl">
          In our restaurant, you are sure to find something for yourself — we serve dishes from all over the world.
        </span>
      </div>
      <div className="col-span-3 place-self-center w-full justify-items-center bg-macDonald ">
        <div className="w-80  h-80 relative">
          <img className=" h-full w-full rounded-3xl bg-cover bg-center	" src={firstBanner.src} alt="banner " />
          <img src={soju.src} className="absolute rotate-45	 h-12 top-[2.5rem] left-[-15px]" />
          <img src={uden.src} className="absolute -rotate-45	 h-12 top-[-1.5rem] right-[4rem] " />
          <img src={chicken.src} className="absolute -rotate-45	 h-12 top-[10rem] right-[-1rem] " />
          <img src={chicken1.src} className="absolute 	 h-14 top-[9rem] left-[-2rem] " />
          <img src={chicken2.src} className="absolute 	 h-14 top-[17rem] left-[1rem] " />
        </div>
      </div>
    </section>
  );
};

export default Banner;
