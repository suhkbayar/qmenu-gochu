import { useRouter } from 'next/router';
import { useCallStore } from '../../contexts/call.store';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { Contact, TimeTable } from '../../components';

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation('language');

  const { participant } = useCallStore();

  const goBack = () => {
    router.push(`/branch?id=${participant.id}`);
  };

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className=" flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={() => goBack()} className="text-2xl text-gray-600" />{' '}
          <span className="text-lg text-primary font-semibold">Бидний тухай</span>
        </div>

        <div className="w-full grid gap-2   mt-8 px-4">
          <div className="grid grid-cols-8">
            <div className="col-span-2 flex justify-center items-center">
              <img src={participant?.branch?.logo} className="w-20 h-20 rounded-lg" alt="logo" />
            </div>

            <div className="col-span-6 grid">
              <span className="text-lg text-primary font-semibold">{participant?.branch?.name}</span>
              <span className="text-gray-600">{participant?.branch?.description}</span>
            </div>
          </div>
        </div>
        <TimeTable timeTable={participant?.branch.timetable} />

        <Contact
          address={participant?.branch.address}
          email={participant?.branch.email}
          phone={participant?.branch.phone}
        />
      </div>
    </section>
  );
};

export default Index;
