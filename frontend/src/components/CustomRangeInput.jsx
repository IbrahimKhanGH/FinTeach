import React from 'react';
import styled from 'styled-components';

const StyledRangeInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 2px;
  background: #d1fae5;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #5aa832;
    cursor: pointer;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #5aa832;
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
`;

const CustomRangeInput = (props) => {
  return <StyledRangeInput type="range" {...props} />;
};

export default CustomRangeInput;
