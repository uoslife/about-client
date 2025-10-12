import { useAnalytics } from '@/entities/analytics/useAnalytics';
import { Text } from '@/shared/component/Text';
import Image from 'next/image';

type Person = {
  name: string;
  major?: string;
  generation?: string;
  position?: string;
  career?: string;
  summary?: string;
  image_profile?: string;
  link_others?: string;
  link_github?: string;
  link_linkedin?: string;
};

interface PeopleCardProps {
  person: Person;
}

export default function PeopleCard({ person }: PeopleCardProps) {
  const { trackEvent } = useAnalytics();
  const openLink = (url: string) => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      window.open(`https://${url}`, '_blank');
    }
  };

  return (
    <div className="w-full md:w-[360px] flex flex-col gap-4 bg-[#f7f7f9] rounded-[16px] md:rounded-[24px] p-5 md:p-6">
      <div className="flex flex-col gap-4 md:gap-5 w-full">
        <div className="flex gap-3 md:gap-4 items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            {person.image_profile ? (
              <Image
                src={person.image_profile}
                alt={person.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gray-800 flex items-center justify-center text-white text-xl md:text-2xl font-bold ${person.image_profile ? 'hidden' : ''}`}
              >
                {person.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Text
              variant="title-24-b"
              color="grey-900"
              className="text-base md:text-2xl"
            >
              {person.name}
            </Text>
            <div className="flex gap-1.5 items-center flex-wrap">
              <div className="bg-white px-3 py-1 md:px-4 rounded-[40px] h-7 md:h-8 flex items-center">
                <Text
                  variant="body-16-m"
                  color="grey-700"
                  className="text-xs md:text-base"
                >
                  {person.generation || '-'}
                </Text>
              </div>
              <div className="bg-white px-3 py-1 md:px-4 rounded-[40px] h-7 md:h-8 flex items-center">
                <Text
                  variant="body-16-m"
                  color="grey-700"
                  className="text-xs md:text-base"
                >
                  {person.position || '-'}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center w-full">
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
              <Image
                width={24}
                height={24}
                src={'/svg/major.svg'}
                alt="major"
              />
            </div>
            <Text
              variant="body-16-m"
              color="grey-700"
              className="flex-1 text-xs md:text-base"
            >
              {person.major || '-'}
            </Text>
          </div>
          <div className="flex gap-2 items-center w-full">
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
              <Image width={24} height={24} src={'/svg/work.svg'} alt="work" />
            </div>
            <Text
              variant="body-16-m"
              color="grey-700"
              className="flex-1 text-xs md:text-base"
            >
              {person.career || '-'}
            </Text>
          </div>
        </div>
      </div>

      <div className="bg-[#e1e1e7] h-px w-full" />

      <div className="min-w-full h-auto md:h-[52px] flex items-start">
        {person.summary && (
          <Text
            variant="body-18-m"
            color="grey-900"
            className="leading-[1.6] line-clamp-2 text-sm md:text-base"
          >
            {person.summary}
          </Text>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-0.5">
        {person.link_others && (
          <button
            className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
            onClick={() => {
              openLink(person.link_others!);
              trackEvent('CLICK_PEOPLE_LINK', {
                link_type: 'others',
              });
            }}
          >
            <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden hover:bg-gray-200">
              <Image
                width={36}
                height={36}
                className="md:w-11 md:h-11"
                src={'/svg/home.svg'}
                alt="home"
              />
            </div>
          </button>
        )}
        {person.link_github && (
          <button
            className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
            onClick={() => {
              openLink(person.link_github!);
              trackEvent('CLICK_PEOPLE_LINK', {
                link_type: 'github',
              });
            }}
          >
            <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden hover:bg-gray-200">
              <Image
                width={36}
                height={36}
                className="md:w-11 md:h-11"
                src={'/svg/github.svg'}
                alt="github"
              />
            </div>
          </button>
        )}
        {person.link_linkedin && (
          <button
            className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
            onClick={() => {
              openLink(person.link_linkedin!);
              trackEvent('CLICK_PEOPLE_LINK', {
                link_type: 'linkedin',
              });
            }}
          >
            <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden hover:bg-gray-200">
              <Image
                width={36}
                height={36}
                className="md:w-11 md:h-11"
                src={'/svg/linkedin.svg'}
                alt="linkedin"
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
