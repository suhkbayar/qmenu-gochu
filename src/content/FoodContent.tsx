import { useEffect, useRef, useState } from 'react';
import { useCallStore } from '../contexts/call.store';
import { IMenuCategory } from '../types';
import { isEmpty, groupBy } from 'lodash';
import { GroupedVirtuoso } from 'react-virtuoso';
import { DraftOrder, ProductCard } from '../components';
import { Icons } from '../assets/category/icons';
import { TYPE } from '../constants/constant';

const filterProducts = ['61333c69-941c-4530-951b-dd3ffd68be80', '58cc52f9-521c-48fd-be7b-b1329c81747c'];

const FoodContent = () => {
  const { participant, order } = useCallStore();
  const virtuoso = useRef(null);
  const navRef = useRef(null);
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (isEmpty(participant)) return;
    const filteredCategories = participant.menu.categories.filter((category) => {
      if (order.type === TYPE.TAKE_AWAY && category.id === '3515c1eb-1d9f-4347-9dab-2b9e88aa0aa1') return false;
      const allProductsInactive = category.products.every((product) => product.state !== 'ACTIVE');
      const allChildrenInactive = category.children.every((childCategory) =>
        childCategory.products.every((product) => product.state !== 'ACTIVE'),
      );
      return !(isEmpty(category.children) ? allProductsInactive : allProductsInactive && allChildrenInactive);
    });
    setCategories(filteredCategories);
  }, [participant]);

  const renderProducts = (products: any) => {
    const filteredProducts = products?.filter((product) => !filterProducts.includes(product.id));

    return filteredProducts?.map((product: any) => (
      <div key={product.id} className="grid">
        <ProductCard
          key={product.id}
          product={product}
          orderItem={order?.items?.find((item) => item.productId === product.productId)}
        />
      </div>
    ));
  };

  const flattenCategories = (categories) => {
    return categories.reduce((acc, category) => {
      return acc.concat(
        { ...category, isChildren: false },
        category.children.map((child) => ({ ...child, isChildren: true })),
      );
    }, []);
  };

  const allCategories = flattenCategories(categories);

  useEffect(() => {
    if (navRef.current && activeIndex !== null) {
      const activeElement = navRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeIndex]);

  const generateGroupedUsers = () => {
    const groupedCategories = groupBy(allCategories, (a: any) => a.id);
    const groupCounts = Object.values(groupedCategories).map((users: any) => users.length);
    return { groupCounts };
  };
  const { groupCounts } = generateGroupedUsers();

  const getFirstItemIndexes = () => {
    return groupCounts.reduce(
      ({ indexes, offset }, count) => {
        indexes.push(offset);
        return { indexes, offset: offset + count };
      },
      { indexes: [], offset: 0 },
    ).indexes;
  };

  const firstItemIndexes = getFirstItemIndexes();

  const handleRangeChanged = ({ startIndex }: { startIndex: number }) => {
    const newGroupIndex = firstItemIndexes.findIndex((idx) => idx === startIndex);
    if (newGroupIndex !== -1 && newGroupIndex !== activeIndex) {
      setActiveIndex(newGroupIndex);
    }
  };

  const onSelectCategory = (groupIndex: number) => {
    const itemIndex = firstItemIndexes[groupIndex]; // scroll to first item in that group
    virtuoso.current?.scrollToIndex({
      index: itemIndex,
      behavior: 'smooth',
    });
    setActiveIndex(groupIndex);
  };

  const onScroll = () => {
    if (window.innerWidth > 640) {
      window.scrollTo({
        top: 800,
        behavior: 'smooth', // Ensures smooth scrolling
      });
    }
  };

  const onScrolling = (status: boolean) => {
    setIsScrolling(status);
  };

  return (
    <section className="grid grid-cols-12">
      <div className="grid   col-span-12 lg:col-span-8 ">
        <div
          className="flex sticky top-[76px] bg-white z-10 overflow-x-auto scrollbar-hide space-x-2 px-4 pt-2 pb-2"
          ref={navRef}
        >
          {groupCounts
            .reduce(
              ({ firstItemsIndexes, offset }, count) => {
                return {
                  firstItemsIndexes: [...firstItemsIndexes, offset],
                  offset: offset + count,
                };
              },
              { firstItemsIndexes: [], offset: 0 },
            )
            .firstItemsIndexes.map((itemIndex, index) => {
              const Icon = Icons[allCategories[index]?.icon] ?? Icons['icon70'];

              return (
                <div
                  key={itemIndex}
                  className={`flex w-48 snap-start rounded-full px-2  py-2  ${
                    activeIndex === itemIndex ? ' bg-current ' : '  '
                  } `}
                >
                  <div className=" w-[3rem] content-center ">
                    <div className="p-2 rounded-full bg-white">
                      <Icon />
                    </div>
                  </div>

                  <div className={`w-28 text-start  content-center`}>
                    <div
                      className={`cursor-pointer text-center text-md ${
                        activeIndex === itemIndex
                          ? 'text-gray-700 rounded-l-xl animate-quantity-change'
                          : 'text-gray-600'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectCategory(itemIndex);
                      }}
                    >
                      <span className=" text-center text-md font-semibold line-clamp-2 ">
                        {allCategories[index].name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="h-screen mb-14">
          <GroupedVirtuoso
            ref={virtuoso}
            onScroll={onScroll}
            groupCounts={groupCounts}
            isScrolling={onScrolling}
            rangeChanged={handleRangeChanged}
            groupContent={(index) => {
              return (
                <div
                  key={index}
                  className=" hidden bg-white py-2 shadow-lg border-t dark:bg-gray-700 dark:text-white border-gray-100 items-center text-center place-content-center text-sm text-gray-500  "
                >
                  {allCategories[index].name}
                </div>
              );
            }}
            itemContent={(index) => {
              return (
                <div
                  key={index}
                  className="grid p-2 pt-0 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5  "
                >
                  {renderProducts(allCategories[index]?.products)}
                </div>
              );
            }}
          />
        </div>
      </div>
      <div className="col-span-4 hidden lg:col-span-0 lg:block">
        <DraftOrder />
      </div>
    </section>
  );
};

export default FoodContent;
