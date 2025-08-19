import { Singletons } from "@shared/utils/SingletonRegistry";
import { TIME } from "@shared/const/time";
import { NotionManager } from "@/shared";
import Image from "next/image";

export const revalidate = TIME.HOUR;

export default async function PeoplePage() {
  const notionManager = Singletons[NotionManager.TOKEN];
  const peopleData = await notionManager.getPeopleData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            팀 소개
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            UOSLIFE 팀원
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {peopleData.map((person) => (
            <div
              key={person.name}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
                    {person.position}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {person.generation}
                  </span>
                </div>

                <div className="flex flex-col items-center text-center">
                  {person.image_profile ? (
                    <div className="w-20 h-20 mb-4 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                      <Image
                        src={person.image_profile}
                        alt={person.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg ring-4 ring-white">
                      {person.name.charAt(0)}
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {person.name}
                  </h2>

                  <p className="text-sm text-gray-600 mb-3">{person.major}</p>

                  {person.career && (
                    <p className="text-xs text-gray-500 mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                      {person.career}
                    </p>
                  )}

                  {person.summary && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 max-h-[4.5rem] overflow-hidden">
                      {person.summary}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative z-10 px-6 pb-6">
                {person.link_others && (
                  <a
                    href={person.link_others}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 group/link shadow-md hover:shadow-lg w-full"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span className="font-medium">더 알아보기</span>
                    <svg
                      className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>

              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium">UOSLIFE Team</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
