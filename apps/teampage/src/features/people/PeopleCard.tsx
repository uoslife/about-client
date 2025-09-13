import { Divider } from '@/shared/component/Divider';
import { Text } from '@/shared/component/Text';
import Image from 'next/image';
import { motion } from 'motion/react';

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
  return (
    <motion.div
      className="w-[360px] flex flex-col gap-6 bg-gray-50 rounded-[24px] px-6 py-8"
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      whileHover={{
        y: -2,
        scale: 1.01,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      transition={{
        duration: 0.4,
        ease: 'easeOut',
      }}
    >
      <div className="flex items-start gap-5">
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
          {person.image_profile ? (
            <Image
              src={person.image_profile}
              alt={person.name}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {person.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Text variant="title-24-b" color="grey-900">
            {person.name}
          </Text>
          <div className="flex flex-col">
            {person.major && (
              <div className="flex items-center gap-2">
                <Image
                  width={24}
                  height={24}
                  src={'/svg/major.svg'}
                  alt="major"
                />
                <Text variant="body-18-m" color="grey-600">
                  {person.major}
                </Text>
              </div>
            )}

            {person.career && (
              <div className="flex items-center gap-2">
                <Image
                  width={24}
                  height={24}
                  src={'/svg/work.svg'}
                  alt="work"
                />
                <Text variant="body-18-m" color="grey-600">
                  {person.career}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
      <Divider
        orientation="horizontal"
        thickness="px"
        color="bg-gray-300"
        className="h-[0.5px]"
      />
      <div className="flex flex-col gap-4">
        <div className="h-[52px] flex items-start">
          {person.summary && (
            <Text variant="body-20-m" color="grey-900" className="line-clamp-2">
              {person.summary}
            </Text>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {person.generation && (
              <div className="bg-white px-4 py-1 rounded-[40px] h-8 flex items-center">
                <Text variant="body-16-m" color="grey-900">
                  {person.generation}
                </Text>
              </div>
            )}
            {
              <div className="bg-white px-4 py-1 rounded-[40px] h-8 flex items-center">
                <Text variant="body-16-m" color="grey-900">
                  {person.position}
                </Text>
              </div>
            }
          </div>
          <div className="flex items-center gap-0.5 ml-auto">
            {person.link_others && (
              <button
                className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
                onClick={() => window.open(person.link_others, '_blank')}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full  overflow-hidden hover:bg-gray-200">
                  <Image
                    width={44}
                    height={44}
                    src={'/svg/home.svg'}
                    alt="home"
                  />
                </div>
              </button>
            )}
            {person.link_github && (
              <button
                className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-[#0F6EFB] transition-colors"
                onClick={() => window.open(person.link_github, '_blank')}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full  overflow-hidden hover:bg-gray-200">
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
                onClick={() => window.open(person.link_linkedin, '_blank')}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full  overflow-hidden hover:bg-gray-200">
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
      </div>
    </motion.div>
  );
}
