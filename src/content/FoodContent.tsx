import { useEffect, useRef, useState, useMemo } from 'react';
import { useCallStore } from '../contexts/call.store';
import { IMenuCategory, IMenuProduct } from '../types';
import { isEmpty } from 'lodash';
import { DraftOrder, ProductCard } from '../components';
import { Icons } from '../assets/category/icons';
import { TYPE } from '../constants/constant';
import { isCurrentlyOpen } from '../utils';

const filterProducts = ['61333c69-941c-4530-951b-dd3ffd68be80', '58cc52f9-521c-48fd-be7b-b1329c81747c'];
const takeAwayExcludedIds = ['3515c1eb-1d9f-4347-9dab-2b9e88aa0aa1', '38cc12cf-391f-4c7f-816d-3e59c19df279'];

const FoodContent = () => {
  const { participant, order } = useCallStore();
  const navRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!participant || isEmpty(participant.menu)) return;

    const filtered = participant.menu.categories.filter((category) => {
      if (order.type === TYPE.TAKE_AWAY && takeAwayExcludedIds.includes(category.id)) return false;

      const allInactive = (products: IMenuProduct[]) => products.every((product) => product.state !== 'ACTIVE');

      const hasActiveProducts = !allInactive(category.products);
      const hasActiveClosedChildren = category.children.some((child) => !allInactive(child.products));

      const categoryOpen = isCurrentlyOpen(category.timetable);

      return categoryOpen && (hasActiveProducts || hasActiveClosedChildren);
    });

    setCategories(filtered);
  }, [participant, order?.type]);

  const flattenCategories = (cats: IMenuCategory[]) =>
    cats.reduce((acc, category) => {
      return acc.concat(
        { ...category, isChildren: false },
        category.children.map((child) => ({ ...child, isChildren: true })),
      );
    }, [] as any[]);

  const allCategories = useMemo(() => flattenCategories(categories), [categories]);

  const scrollToCategory = (index: number) => {
    const catId = allCategories[index]?.id;
    const el = sectionsRef.current[catId];
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveIndex(index);
  };

  const renderProducts = (products: IMenuProduct[]) =>
    products
      ?.filter((product) => !filterProducts.includes(product.id))
      ?.map((product) => (
        <div key={product.id} className="grid">
          <ProductCard
            product={product}
            orderItem={order?.items?.find((item) => item.productId === product.productId)}
          />
        </div>
      ));

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      for (let i = 0; i < allCategories.length; i++) {
        const catId = allCategories[i].id;
        const el = sectionsRef.current[catId];
        if (el) {
          const offsetTop = el.offsetTop;
          if (top >= offsetTop - 150) {
            setActiveIndex(i);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allCategories]);

  useEffect(() => {
    if (navRef.current) {
      const activeElement = navRef.current.children[activeIndex] as HTMLElement;
      activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8">
        <div
          className="flex sticky top-[76px] bg-white z-10 overflow-x-auto scrollbar-hide space-x-2 px-4 pt-2 pb-2"
          ref={navRef}
        >
          {allCategories.map(({ name, icon }, index) => {
            const Icon = Icons[icon] ?? Icons['icon70'];
            const isActive = activeIndex === index;

            return (
              <div key={index} className={`flex w-48 rounded-full px-2 py-2 ${isActive ? 'bg-current' : ''}`}>
                <div className="w-[3rem] content-center">
                  <div className="p-2 rounded-full bg-white">
                    <Icon />
                  </div>
                </div>
                <div className="w-28 text-start content-center">
                  <div
                    className={`cursor-pointer text-center text-md ${
                      isActive ? 'text-gray-700 animate-quantity-change' : 'text-gray-600'
                    }`}
                    onClick={() => scrollToCategory(index)}
                  >
                    <span className="text-md font-semibold line-clamp-2">{name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-14">
          {allCategories.map((cat, index) => (
            <div
              key={cat.id}
              ref={(el) => (sectionsRef.current[cat.id] = el)}
              className="px-4 py-6 border-b border-gray-100 pt-0 mb-4"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{cat.name}</h2>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5">
                {renderProducts(cat.products)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 hidden lg:block">
        <DraftOrder />
      </div>
    </section>
  );
};

export default FoodContent;
