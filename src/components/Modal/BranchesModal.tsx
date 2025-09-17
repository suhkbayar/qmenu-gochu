import { Modal } from 'flowbite-react';
import { customThemeDraftModal } from '../../../styles/themes';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../../graphql/query';
import { useEffect, useState } from 'react';
import { useCallStore } from '../../contexts/call.store';
import { useRouter } from 'next/router';
import { CURRENT_TOKEN } from '../../graphql/mutation/token';
import { setAccessToken } from '../../providers/auth';
import { FiHeart } from 'react-icons/fi';
import { EDIT_FAVOURITE } from '../../graphql/mutation/favourites';
import { GET_FAVOURITE_IDS } from '../../graphql/query/favourites';
import { FavouriteItemType } from '../../types';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const filteredBranch = ['1edeb298-61d6-495e-b61e-7d22b16f1f14'];

const BranchesModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const { t } = useTranslation('language');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { participant, setSelectedParticipant, selectedParticipant } = useCallStore();

  const { data: favouriteIds, refetch: refetchFavouriteIds } = useQuery(GET_FAVOURITE_IDS, {
    variables: {
      type: FavouriteItemType.BRANCH,
    },
  });

  const [editFavourite] = useMutation(EDIT_FAVOURITE, {
    onCompleted: () => {
      refetchFavouriteIds();
    },
  });

  const [getBranches, { data }] = useLazyQuery(GET_BRANCHES, {
    onCompleted: (data) => {
      setBranches(data?.getParticipants?.filter((item) => !filteredBranch.includes(item?.id)));
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

  const handleToggleFavorite = (e: React.MouseEvent, branchId: string) => {
    e.stopPropagation();
    editFavourite({
      variables: {
        id: branchId,
        type: FavouriteItemType.BRANCH,
      },
    });
  };

  const isFavourite = (branchId: string) => {
    return favouriteIds?.getFavouriteIds?.includes(branchId) || false;
  };

  return (
    <Modal
      theme={customThemeDraftModal}
      className={`w-full p-0 `}
      position="center"
      dismissible
      show={visible}
      onClose={onCloseBranchSelect}
    >
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

                  <div className="col-span-2 flex justify-end items-center">
                    <button
                      onClick={(e) => handleToggleFavorite(e, item?.id)}
                      className={`p-2 rounded-full shadow-sm transition-colors ${
                        isFavourite(item?.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiHeart className={`w-4 h-4 ${isFavourite(item?.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="col-span-6 h-12   flex self-center items-center font-semibold text-gray-700">
                    <span className="line-clamp-2">{item?.branch?.address}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4 z-10">
        <div className="w-full flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Буцах
          </button>
          <button
            onClick={goDelivery}
            disabled={isEmpty(selectedBranch)}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isEmpty(selectedBranch)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-current text-white hover:opacity-90'
            }`}
          >
            {t('mainPage.ToBeContinued')}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BranchesModal;
