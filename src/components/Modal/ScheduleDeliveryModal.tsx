import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customThemeScheduleModal } from '../../../styles/themes';
import { isEmpty } from 'lodash';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
};

const ScheduleDeliveryModal = ({ visible, onClose, onConfirm }: Props) => {
  const { t } = useTranslation('language');
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [dates, setDates] = useState<{ label: string; date: string }[]>([]);
  const [times, setTimes] = useState<string[]>([]);

  // Generate the next 5 days
  useEffect(() => {
    const generateDates = () => {
      const newDates = [];
      const today = new Date();
      for (let i = 0; i < 5; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);
        const label =
          i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : futureDate.toLocaleDateString('en-US', { weekday: 'short' });
        const date = futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        newDates.push({ label, date });
      }
      setDates(newDates);
    };

    generateDates();
  }, []);

  // Generate times based on the selected date
  useEffect(() => {
    const generateTimes = () => {
      const newTimes = [];
      const now = new Date();

      if (selectedDate === 'Today') {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        for (let hour = currentHour; hour < 23; hour++) {
          if (hour === currentHour && currentMinute > 30) {
            continue; // Skip the current hour if more than 30 minutes have passed
          }

          const startTime = new Date();
          startTime.setHours(hour, hour === currentHour && currentMinute > 0 ? 30 : 0, 0);

          const endTime = new Date(startTime);
          endTime.setHours(hour + 1);

          newTimes.push(
            `${startTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          );
        }
      } else {
        // For other dates, start from 8:00 AM
        for (let hour = 8; hour < 23; hour++) {
          const startTime = new Date();
          startTime.setHours(hour, 0, 0);

          const endTime = new Date();
          endTime.setHours(hour + 1);

          newTimes.push(
            `${startTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          );
        }
      }
      setTimes(newTimes);
    };

    generateTimes();
  }, [selectedDate]);

  const onFinished = () => {
    if (isEmpty(selectedTime && selectedDate)) return;

    onConfirm(selectedDate, selectedTime);
  };

  return (
    <Modal
      theme={customThemeScheduleModal}
      className={`w-full p-0  `}
      position="center"
      dismissible
      show={visible}
      onClose={onClose}
    >
      <div>
        <Modal.Header className="bg-current ">
          <span className="text-lg text-white">Хуваарь сонгох</span>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-[74vh] overflow-auto mb-[103px]">
            <div className="flex space-x-2 overflow-x-auto mb-4">
              {dates.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedDate(item.label)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedDate === item.label ? 'bg-current text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="text-sm font-semibold">{t(`mainPage.${item.label}`)}</div>
                  <div className="text-xs">{item.date}</div>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {times.map((time) => (
                <div
                  key={time}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectedTime === time ? 'border-current bg-gray-100' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  <span className="flex-1 text-sm">{time}</span>
                  <input
                    type="radio"
                    checked={selectedTime === time}
                    onChange={() => setSelectedTime(time)}
                    className="form-radio text-current "
                  />
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="  absolute bg-white bottom-0 w-full space-x-0 p-0">
          <div className="w-full p-4  flex  text-sm place-items-center">
            <button
              onClick={() => onFinished()}
              className={`flex w-full font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: ${
                isEmpty(selectedTime && selectedDate) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              Баталгаажуулах
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ScheduleDeliveryModal;
