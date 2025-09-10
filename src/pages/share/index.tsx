import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineCopy } from 'react-icons/ai';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useCallStore } from '../../contexts/call.store';
import { useState } from 'react';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('language');
  const { participant } = useCallStore();
  const [copied, setCopied] = useState(false);

  const goBack = () => {
    router.push(`/profile?id=${id}`);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const branchUrl = `${shareUrl}/branch?id=${participant?.id}`;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(branchUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = branchUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed: ', fallbackErr);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToFacebook = () => {
    const message = `Энэ рестораныг сонирхоорой: ${branchUrl}`;

    const messengerUrl = `https://m.me/?text=${encodeURIComponent(message)}`;

    const link = document.createElement('a');
    link.href = messengerUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareToInstagram = () => {
    const instagramUrl = `https://www.instagram.com/direct/inbox/`;

    const link = document.createElement('a');
    link.href = instagramUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareOptions = [
    {
      id: 'copy',
      title: 'Холбоос хуулах',
      description: 'Салбарын холбоосыг хуулах',
      icon: AiOutlineCopy,
      action: copyToClipboard,
    },
    {
      id: 'facebook',
      title: 'Facebook дээр хуваалцах',
      description: 'Facebook дээр хуваалцах',
      icon: FaFacebook,
      action: shareToFacebook,
      iconColor: 'text-blue-600',
    },
    {
      id: 'instagram',
      title: 'Instagram дээр хуваалцах',
      description: 'Instagram дээр хуваалцах',
      icon: FaInstagram,
      action: shareToInstagram,
      iconColor: 'text-pink-600',
    },
  ];

  return (
    <section className="flex w-full justify-center">
      <div className="relative w-full h-screen sm:w-3/6 md:w-3/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5">
        <div className="flex gap-4 items-center w-full mt-4 px-4">
          <IoArrowBack onClick={goBack} className="text-2xl text-gray-600" />
          <span className="text-lg text-primary font-semibold">{t('mainPage.ShareWithOthers')}</span>
        </div>

        <div className="px-4 mt-6">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-6 text-white mb-6">
            <h2 className="text-xl font-bold mb-2">{participant?.branch?.name} салбарыг хуваалцах</h2>
            <p className="text-blue-100 mb-4">Найз нөхдөдөө энэ салбарын цэсийг үзүүлээрэй</p>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm break-all">{branchUrl}</p>
            </div>
          </div>

          <div className="space-y-4">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              const iconColor = option.iconColor || 'text-primary';
              const bgColor =
                option.id === 'facebook'
                  ? 'bg-blue-50'
                  : option.id === 'instagram'
                  ? 'bg-pink-50'
                  : 'bg-primary bg-opacity-10';
              return (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${bgColor} p-3 rounded-lg`}>
                      <IconComponent className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {copied && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Холбоос хуулагдлаа!
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Хуваалцах тухай</h3>
            <p className="text-sm text-gray-600">
              Та найз нөхдөдөө энэ салбарын цэсийг хуваалцаж, тэдэнд захиалга өгөх боломжийг олгоно. Хуваалцсан
              холбоосоор орж ирсэн хүмүүс шууд захиалга өгөх боломжтой болно.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
