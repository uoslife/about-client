import Image from "next/image";
import Link from "next/link";

function OurStoryMenu() {
	return (
		<div
			className="hidden group-hover:block absolute top-full w-40 bg-white box-border flex-col gap-2 items-start justify-start p-[12px] rounded-2xl shadow-[0px_0px_12px_0px_rgba(18,18,18,0.1)]"
			data-name="GNB_Tap2"
			data-node-id="237:2120"
		>
			<Link href="/career" className="w-full">
				<div
					className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] shrink-0 w-full hover:bg-gray-100"
					data-name="GNB_Tap"
				>
					<div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#54545c] text-[20px] text-center text-nowrap">
						<p className="block leading-[1.5] whitespace-pre">Career</p>
					</div>
				</div>
			</Link>
			<Link href="/memories" className="w-full">
				<div
					className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] shrink-0 w-full hover:bg-gray-100"
					data-name="GNB_Tap"
				>
					<div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#54545c] text-[20px] text-center text-nowrap">
						<p className="block leading-[1.5] whitespace-pre">Memories</p>
					</div>
				</div>
			</Link>
		</div>
	);
}
export default function Header() {
	return (
		<header
			className="sticky top-0 z-50 backdrop-blur-[25px] backdrop-filter bg-[rgba(255,255,255,0.8)] box-border flex flex-row items-center justify-between px-8 max-w-[1440px] py-4 w-full"
			data-name="GNB"
			data-node-id="237:2119"
		>
			<Link href="/">
				<Image
					src="/svg/uoslife_logo.svg"
					alt="uoslife logo icon"
					height={20}
					width={100}
				/>
			</Link>
			<div className="absolute box-border content-stretch flex flex-row gap-4 items-center justify-start left-1/2 p-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<Link href="/">
					<div
						className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] shrink-0 hover:bg-gray-100 transition-colors"
						data-name="GNB_Tap"
					>
						<div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#121212] text-[20px] text-center text-nowrap">
							<p className="block leading-[1.5] whitespace-pre">Home</p>
						</div>
					</div>
				</Link>
				<Link href="/people">
					<div
						className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] shrink-0 hover:bg-gray-100 transition-colors"
						data-name="GNB_Tap"
					>
						<div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#121212] text-[20px] text-center text-nowrap">
							<p className="block leading-[1.5] whitespace-pre">People</p>
						</div>
					</div>
				</Link>
				<Link href="/tech">
					<div
						className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] shrink-0 hover:bg-gray-100 transition-colors"
						data-name="GNB_Tap"
					>
						<div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#121212] text-[20px] text-center text-nowrap">
							<p className="block leading-[1.5] whitespace-pre">Tech</p>
						</div>
					</div>
				</Link>
				<div className="relative group">
					<Link href="/career">
						<div
							className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] shrink-0 hover:bg-gray-100 transition-colors"
							data-name="GNB_Tap"
						>
							<div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#121212] text-[20px] text-center text-nowrap">
								<p className="block leading-[1.5] whitespace-pre">Our Story</p>
							</div>
						</div>
					</Link>
					<OurStoryMenu />
				</div>
			</div>
			<div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0">
				<div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-0 relative shrink-0">
					<div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
						<Image
							src="/svg/search.svg"
							alt="search icon"
							width={44}
							height={44}
							className="hover:bg-gray-100 rounded-xl"
						/>
						<a
							href="https://instagram.com/uoslife_official"
							target="_blank"
							rel="noopener"
							className="hover:bg-gray-100 rounded-xl"
						>
							<Image
								src="/svg/instagram.svg"
								alt="instagram icon"
								width={44}
								height={44}
							/>
						</a>
						<a
							href="https://github.com/uoslife"
							target="_blank"
							rel="noopener"
							className="hover:bg-gray-100 rounded-xl"
						>
							<Image
								src="/svg/github.svg"
								alt="github icon"
								width={44}
								height={44}
							/>
						</a>
					</div>
				</div>
				<div className="flex justify-center items-center gap-7">
					<div className="bg-[#e9e9ee] h-7 rounded shrink-0 w-0.5" />
					<button
						type="button"
						className="bg-[#4686ff] h-11 flex items-center justify-center px-5 py-1 rounded-xl"
					>
						<p className="text-white whitespace-pre">Login</p>
					</button>
				</div>
			</div>
		</header>
	);
}
