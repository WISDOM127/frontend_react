import { Grid } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
//import styled from "styled-components";
import styled, { keyframes } from "styled-components";
import Table from "../components/Table";

/* 검색 창 스타일 */
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; // 수평 가운데 정렬을 위해 추가
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 300px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SearchButton = styled.button`
  padding: 10px 15px;
  background-color: #42a5f5;
  //#0d47a1;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const slideUp = keyframes`
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(-8%);
  }
  65% {
    transform: translateY(4%);
  }
  80% {
    transform: translateY(-4%);
  }
  95% {
    transform: translateY(2%);
  }
  100% {
    transform: translateY(0%);
  }
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #0d47a1;
  animation: ${slideUp} 1s ease;
  /* Add other styles as needed */
`;

const AnswerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; // 수평 가운데 정렬을 위해 추가
  margin: 50px auto;
  width: 1000px;
`;

const SearchBar = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [flightData, setFlightData] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const handleSearch = async () => {
    setLoading(true); //로딩 상태 활성화
    try {
      console.log("부트 전송전" + searchText);
      const response = await axios.post("/airRoute/searchFlight", searchText);
      console.log("요청성공" + searchText);

      //Boot 에서 반환한 데이터를 congestionData 에 저장
      setFlightData(response.data);
      setShowTable(response.data.flightId !== null); // 결과가 있는 경우에만 테이블 보이도록 설정
      console.log(response);
      console.log(response.data);

      console.log(response.data.remark);
      console.log("서버에서 받은 데이터 :" + flightData.flightId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  function createData(
    flightId,
    airline,
    airport,
    scheduleDateTime,
    estimatedDateTime,
    remark
  ) {
    return {
      flightId,
      airline,
      airport,
      scheduleDateTime,
      estimatedDateTime,
      remark,
    };
  }

  const rows = showTable
    ? [
        createData(
          flightData.flightId,
          flightData.airline,
          flightData.airport,
          flightData.scheduleDateTime,
          flightData.estimatedDateTime,
          flightData.remark
        ),
      ]
    : [];

  return (
    <Grid item xs={12}>
      <TextContainer>실시간 항공편을 검색해보세요!</TextContainer>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="항공편명을 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </SearchContainer>
      <AnswerContainer>
        {/* 대기중일때 */}
        {loading && <SearchContainer>대기중...</SearchContainer>}
        {/* 로딩이 끝난 후 검색결과 */}
        {!loading && (
          <>
            {!showTable && !flightData && <p></p>}
            {!showTable && flightData && <p>검색 결과가 없습니다.</p>}
            {showTable && flightData && <Table rows={rows} />}
          </>
        )}
      </AnswerContainer>
    </Grid>
  );
};

export default SearchBar;
