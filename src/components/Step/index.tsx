import React from 'react';

type Props = {
  totalSteps: number;
  activeStep: number;
};

const Step = ({ totalSteps, activeStep }: Props) => {
  const getSteps = (step: number, activeStep: number) => {
    const stepsArray: JSX.Element[] = [];

    for (let i: number = 0; i < step; i++) {
      stepsArray.push(
        <li className=" flex w-full">
          <p key={i} className={` p-[4px] w-full rounded-md   ${activeStep > i ? 'bg-primary' : 'bg-gray-200 '}`}></p>
        </li>,
      );
    }
    return stepsArray;
  };
  const steps = getSteps(totalSteps, activeStep);

  return (
    <ol className=" flex items-center w-full  space-x-4 ">
      {steps.map((step, index) => (
        <React.Fragment key={index}>{step}</React.Fragment>
      ))}
    </ol>
  );
};

export default Step;
