import { useCallStore } from '../../contexts/call.store';
import { CiTrash } from 'react-icons/ci';
import { moneyFormat } from '../../helpers/formatters';
import { FiCheck } from 'react-icons/fi';
import { isEmpty } from 'lodash';
import { IoIosClose } from 'react-icons/io';

const DraftOrder = () => {
  const { order } = useCallStore();
  const { remove } = useCallStore();

  return (
    <div className="rounded-2xl shadow-md mt-4 mr-4">
      <div className="flex w-full rounded-t-2xl p-2 justify-center bg-current ">
        <span className="text-center text-lg text-white ">Миний захиалга</span>
      </div>
      {!isEmpty(order?.items) && (
        <>
          <div className="grid gap-4 p-4">
            {order?.items.map((item: any) => (
              <div className="grid grid-cols-6">
                <span className="col-span-4 flex self-center items-center font-semibold text-gray-700">
                  {item.quantity} <IoIosClose /> {item.name}
                </span>
                <div className="flex col-span-2 justify-between items-center">
                  <span>{item.price.toLocaleString()} ₮</span>
                  <CiTrash onClick={() => remove(item)} className="text-lg text-red-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-b my-2"></div>
        </>
      )}

      <div className="flex justify-between  p-4">
        <span className=" font-semibold">Нийт</span>
        {order && <span className="font-semibold">{moneyFormat(order?.totalAmount)} ₮</span>}
      </div>

      <div className="flex  w-full justify-center mt-4 p-4 ">
        <div
          className={` flex items-center	gap-2  p-2 rounded-3xl px-6
            ${isEmpty(order?.items) ? ' bg-gray-300 text-white ' : 'bg-current text-white '}
            `}
        >
          <FiCheck />
          <span>Баталгаажуулах</span>
        </div>
      </div>
    </div>
  );
};

export default DraftOrder;
