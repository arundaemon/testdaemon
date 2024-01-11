import React from "react";
import styled from "styled-components";

const MultiSelectContainer = styled.div`
  overflow:auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  height:169px;
`;

const MultiSelectValue = styled.div`
  align-items: center;
  margin-top: 0.4rem;
  margin-down: 0.5rem;
  background-color: #e2e6ea;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display:block;

`;

const MultiSelectRemove = styled.button`
  margin-left: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #6c757d;
`;


const TaggedCities = ({ selectedCity, setSelectedCity, handleAddCity }) => {

  return (
    <MultiSelectContainer>
      <div className="multi-select-values">
        {selectedCity?.map((option, index) => (
          <MultiSelectValue key={index}>
            {option?.cityName}
            <MultiSelectRemove
              style={{ fontSize: 'larger' }}
              onClick={() =>
                setSelectedCity(selectedCity?.filter((o) => o !== option))
              }
            >
              X
            </MultiSelectRemove>
          </MultiSelectValue>
        ))}
      </div>
    </MultiSelectContainer>
  );
};

export default TaggedCities;

