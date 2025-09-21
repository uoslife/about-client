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
  const openLink = (url: string) => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      window.open(`https://${url}`, '_blank');
    }
  };

  return (
    <div className="w-[360px] flex flex-col gap-4 bg-[#f7f7f9] rounded-[24px] p-6">
      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
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
                className={`w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold ${person.image_profile ? 'hidden' : ''}`}
              >
                {person.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Text variant="title-24-b" color="grey-900">
              {person.name}
            </Text>
            <div className="flex gap-1.5 items-center">
              <div className="bg-white px-4 py-1 rounded-[40px] h-8 flex items-center">
                <Text variant="body-16-m" color="grey-700">
                  {person.generation || '-'}
                </Text>
              </div>
              <div className="bg-white px-4 py-1 rounded-[40px] h-8 flex items-center">
                <Text variant="body-16-m" color="grey-700">
                  {person.position || '-'}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center w-full">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image
                width={24}
                height={24}
                src={'/svg/major.svg'}
                alt="major"
              />
            </div>
            <Text variant="body-16-m" color="grey-700" className="flex-1">
              {person.major || '-'}
            </Text>
          </div>
          <div className="flex gap-2 items-center w-full">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image width={24} height={24} src={'/svg/work.svg'} alt="work" />
            </div>
            <Text variant="body-16-m" color="grey-700" className="flex-1">
              {person.career || '-'}
            </Text>
          </div>
        </div>
      </div>

      <div className="bg-[#e1e1e7] h-px w-full" />

      <div className="min-w-full h-[52px] flex items-start">
        {person.summary && (
          <Text
            variant="body-18-m"
            color="grey-900"
            className="leading-[1.6] line-clamp-2"
          >
            {person.summary}
          </Text>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {person.link_others && (
          <button
            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
            onClick={() => openLink(person.link_others!)}
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden hover:bg-gray-200">
              <Image width={44} height={44} src={'/svg/home.svg'} alt="home" />
            </div>
          </button>
        )}
        {person.link_github && (
          <button
            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
            onClick={() => openLink(person.link_github!)}
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden hover:bg-gray-200">
              <Image
                width={44}
                height={44}
                src={'/svg/github.svg'}
                alt="github"
              />
            </div>
          </button>
        )}
        {person.link_linkedin && (
          <button
            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
            onClick={() => openLink(person.link_linkedin!)}
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden hover:bg-gray-200">
              <Image
                width={44}
                height={44}
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
