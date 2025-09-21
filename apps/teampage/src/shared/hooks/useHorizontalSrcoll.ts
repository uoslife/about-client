import { useState, useRef, useEffect } from "react";

type Options<T> = {
    data: { category: T }[];
};

export function useHorizontalScroll<T extends string>({ data }: Options<T>) {
    const [category, setCategory] = useState<T>(data[0].category);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    /** 
     * 카테고리 탭 클릭
    */
    const handleTabClick = (cat: T) => {
        const targetIndex = data.findIndex((d) => d.category === cat);
        if (targetIndex !== -1) {
        itemRefs.current[targetIndex]?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
        }
    };

    /**
     * 이전 버튼 클릭
     */
    const handlePrevClick = () => {
        const prevIndex = Math.max(currentIndex - 1, 0);
        itemRefs.current[prevIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
        });
    };

    /**
     * 다음 버튼 클릭
     */
    const handleNextClick = () => {
        const nextIndex = Math.min(currentIndex + 1, data.length - 1);
        itemRefs.current[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
        });
    };

    /**
     * 스크롤 이벤트 - 가장 중앙에 가까운 아이템을 현재 카테고리로 설정
     */
    useEffect(() => {
        const handleScroll = () => {
        if (!scrollRef.current) return;

        let closestIndex = 0;
        let minDistance = Infinity;

        itemRefs.current.forEach((el, index) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const elCenter = rect.left + rect.width / 2;
            const distance = Math.abs(window.innerWidth / 2 - elCenter);

            if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
            }
        });

        setCategory(data[closestIndex].category);
        setCurrentIndex(closestIndex);
        };

        const el = scrollRef.current;
        el?.addEventListener("scroll", handleScroll, { passive: true });
        return () => el?.removeEventListener("scroll", handleScroll);
    }, [data]);

    return {
        category,
        currentIndex,
        scrollRef,
        itemRefs,
        handleTabClick,
        handlePrevClick,
        handleNextClick,
    };
}
