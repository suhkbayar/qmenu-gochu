import { Modal } from 'flowbite-react';
import { customThemeDraftModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_BRANCHES } from '../../graphql/query';
import { useEffect, useState } from 'react';
import { useCallStore } from '../../contexts/call.store';
import { useRouter } from 'next/router';
import { CURRENT_TOKEN } from '../../graphql/mutation/token';
import { setAccessToken } from '../../providers/auth';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const BranchesModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { participant, setSelectedParticipant, selectedParticipant } = useCallStore();

  const [getBranches, { data }] = useLazyQuery(GET_BRANCHES, {
    onCompleted: (data) => {
      setBranches(data?.getParticipants);
    },
  });

  const [currentToken] = useMutation(CURRENT_TOKEN, {
    onError: (err) => {
      router.push('/notfound');
    },
  });

  useEffect(() => {
    if (visible) {
      getBranches();
    }
  }, [visible]);

  const goDelivery = () => {
    if (isEmpty(selectedBranch)) {
      router.push(`/`);
    }

    setSelectedParticipant(selectedBranch);
    currentToken({
      variables: {
        code: selectedBranch?.id,
        type: 'K',
      },
      onCompleted: (data) => {
        setAccessToken(data.getToken.token);
        router.push(`/branch?id=${selectedBranch?.id}`);
      },
    });
  };

  const onCloseBranchSelect = () => {
    setSelectedParticipant(participant);
    onClose();
  };

  return (
    <Modal
      theme={customThemeDraftModal}
      className={`w-full p-0  `}
      position="center"
      dismissible
      show={visible}
      onClose={onCloseBranchSelect}
    >
      <div>
        <Modal.Header className="bg-current ">
          <span className="text-lg text-white">Салбар сонгох</span>
        </Modal.Header>
        <Modal.Body>
          <div className="h-fit overflow-auto mb-16">
            {!isEmpty(branches) && (
              <div className="grid gap-4 ">
                {branches?.map((item: any) => (
                  <div
                    className={`grid grid-cols-6 gap-2 p-2 rounded-lg  bg-gray-100 shadow-sm  border cursor-pointer  ${
                      selectedBranch?.id === item?.id ? '  border-current' : ' border-transparent'
                    }  `}
                    key={item?.id}
                    onClick={() => setSelectedBranch(item)}
                  >
                    <div className="flex col-span-1 justify-between items-center">
                      <img className=" rounded-md h-12 object-cover bg-center " src={item?.branch?.logo} />
                    </div>

                    <span className="col-span-3 flex self-center items-center font-semibold text-gray-700">
                      {item?.branch?.name}
                    </span>
                    <div className="col-span-6 h-12   flex self-center items-center font-semibold text-gray-700">
                      <span className="line-clamp-2">{item?.branch?.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="  fixed bg-white bottom-0 w-full space-x-0 p-0">
          <div className="w-full p-4 flex justify-between text-sm place-items-center">
            <button
              onClick={() => onClose()}
              className={`flex font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: 
          bg-gray-300 text-gray-500
             px-4 py-4 text-sm`}
            >
              Буцах
            </button>
            <button
              onClick={() => goDelivery()}
              className={`flex font-semibold cursor-pointer place-content-center items-center rounded-lg  first-line: ${
                isEmpty(selectedBranch) ? 'bg-gray-300 text-gray-500' : 'bg-current text-white'
              } px-4 py-4 text-sm`}
            >
              {t('mainPage.ToBeContinued')}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default BranchesModal;
