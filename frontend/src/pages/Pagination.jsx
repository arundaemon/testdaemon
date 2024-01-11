import React from 'react'

const Pagination = ({ pageNo, setPagination, lastPage, nextPageDisabled, prevPageDisaled }) => {

  const handleNext = () => {
    setPagination(pageNo + 1)
  }

  const handlePrevious = () => {
    setPagination(pageNo - 1)
  }

  const previousButtonStyle = {
    borderRadius: "4px",
    color: pageNo <= 1 ? "#cbc5c5" : "black",
    padding: "6px 24px",
    lineHeight: "24px",
    cursor: "pointer",
    display: "inline-block",
    marginRight: "-24px",
    height: '38px',
    marginBottom: "10px",
    fontSize: '25px',
    border: "transparent",
    backgroundColor: "inherit"
  }

  const nextButtonStyle = {
    borderRadius: "4px",
    color: lastPage ? "#cbc5c5" : "black",
    padding: "6px 24px",
    marginBottom: "10px",
    lineHeight: "24px",
    cursor: "pointer",
    display: "inline-block",
    marginRight: "20px",
    height: '38px',
    fontSize: '25px',
    border: "transparent",
    backgroundColor: "inherit",
    // cursor: lastPage ? "not-allowed" : "pointer",

  }
  const isNextButtonDisabled = (nextPageDisabled !== undefined && nextPageDisabled !== null)
    ? nextPageDisabled
    : lastPage;
  const isPreviousButtonDisabled = (prevPageDisaled !== undefined && prevPageDisaled !== null)
    ? prevPageDisaled
    : pageNo <= 1;
  return (
    <div>
      {"Page: " + pageNo}
      <button title={pageNo > 1 ? "Go to previous page" : ""} onClick={handlePrevious} disabled={isPreviousButtonDisabled} style={previousButtonStyle}>{"<"}</button>
      <button title={!lastPage ? "Go to Next page" : ""} onClick={handleNext} disabled={isNextButtonDisabled} style={nextButtonStyle}>{">"}</button>
    </div >
  )
}

export default Pagination