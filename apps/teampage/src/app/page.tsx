import Header from "@shared/components/Header";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center">
			<Header />
			<main>
				<div className="relative mx-10 px-24 bg-black rounded-3xl overflow-hidden flex items-center justify-center">
					<Image
						src="/main.webp"
						alt="Uoslife Logo"
						width={1800}
						height={1800}
						priority
						className="object-cover h-[85vh]"
					/>
					<MainGroup />
				</div>
			</main>
		</div>
	);
}
function MainGroup() {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center">
			<div className="px-10 max-w-[1280px] mx-auto flex flex-col w-full gap-6 items-center">
				<div className="flex flex-col w-full gap-6">
					<div className="ml-32 py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-start">
						<p className="text-[28px] text-white">UX/UI Design</p>
					</div>
					<div className="py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-start">
						<p className="text-[28px] text-white">Product Management</p>
					</div>
				</div>
				<div className="flex flex-col w-full gap-6">
					<div className="mr-14 py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-end">
						<p className="text-[28px] text-white">FE/BE Develop</p>
					</div>
					<div className="py-[10px] font-['Pretendard:Medium',_sans-serif] px-7 border-2 border-[rgba(255,255,255,0.5)] rounded-[30px] self-end">
						<p className="text-[28px] text-white">Marketing</p>
					</div>
				</div>
			</div>
			<div>
				<h1 className="text-center font-bold text-7xl leading-tight text-white whitespace-pre-line">
					{"시대생,\n모든 시대인을 연결하다 —"}
				</h1>
				<h2 className="mt-12 text-white text-center text-2xl">
					시대생팀은 기술을 통해 편리하고 즐거운 학교생활을 만듭니다.
				</h2>
			</div>
		</div>
	);
}
