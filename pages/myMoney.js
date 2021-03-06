import { useEffect, useState } from 'react';
import {Doughnut} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Seo from '../Components/Seo';
import InputKey from '../Components/InputKey';
import * as api from '../Function/api';

import UpbitApiInfo from '../Components/UpbitApiInfo';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MyMoney(){
    // 매수 금액
    const [myMoney, setMyMoney] = useState();
    // 손실 혹은 이익이 합쳐진 내 자산
    const [myRealMoney, setMyRealMoney] = useState();
    // 보유 코인 이름
    const [names, setNames] = useState();
    // 보유 코인 매수한 금액
    const [moneys, setMoneys] = useState();
    // api 키를 저장 했는지
    const [haveKey, setHaveKey] = useState(false);
    // 업비트 설명 열고 닫기
    const [toggleUpbit, setToggleUpbit] = useState(false);

    // 내 자산 가져오기
    const getMyMoney = async() => {
        // localStorage에 upbit api key 가져오기
        let api_key = JSON.parse(window.localStorage.getItem('bitmall'));

        // api key가 있으면 자산데이터 조회 및 가공하기
        if(api_key){
            const my_upbit_asset = await api.getMyUpbitMoney(api_key);
            
            setNames(my_upbit_asset.names);
            setMoneys(my_upbit_asset.moneys);
            setMyMoney(Math.round(my_upbit_asset.total_my_money));
            setMyRealMoney(Math.round(my_upbit_asset.realMoney));
            setHaveKey(true);
        }
    }

    // 도넛 그래프 data
    const doughnut_data = {
      labels: names,
      datasets: [
        {
          labels: names,
          data: moneys,
          borderWidth: 2,
          hoverBorderWidth: 3,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1
        }
      ]
    };

   
    useEffect(() => {
        getMyMoney();
    },[]);

    // 실시간 변동 
    useEffect(() => {
        const count = setInterval(() => {
            getMyMoney();
        }, 3000);

        return () => clearInterval(count);
    });
  
    return (
        <>
            <Seo title="MyMoney"/>
            {
                haveKey ? (
                    <div className='my_money_wrap'>
                        <div className='chart'>
                        {!myRealMoney &&
                        <div>Loding...</div>}
                        {
                            myRealMoney && 
                            <>
                                <InputKey haveKey={true}/>
                                <Doughnut data={doughnut_data}/>
                                <div className='text'>
                                    {`매수금액 : ${myMoney}원`}
                                    <br></br>
                                    {`지금 내돈 : ${myRealMoney}원`}
                                    <br></br>
                                    {myRealMoney-myMoney > 0 ? `수익중 : ` : `손실중 : `}{`${myRealMoney-myMoney}원`}
                                    <br></br>
                                    {myRealMoney-myMoney > 0 ? `수익률 : ` : `손실률 : `}{`${(((myRealMoney-myMoney)/myMoney)*100).toFixed(2)}%`}
                                </div>
                            </>
                        }
                        
                    </div>
                    
                    <style jsx>{`
                        .my_money_wrap{
                            text-align: center;
                        }
                        .chart{
                            width: 500px;
                            height: 500px;
                            margin-bottom: 50px;
                            display: inline-block;
                        }
                        .text{
                            text-align: center;
                        }

                        @media screen and (max-width: 768px) {
                            .chart{
                                width: 90%;
                                height: 90%;
                                margin-bottom: 50px;
                            }
                            .text{
                                margin-top: 10px;
                                margin-left: 0px;
                                text-align: center;
                            }
                        }
                    `}</style>
                </div>
                ) : (
                    <>
                        <div>
                            <InputKey haveKey={false}/>
                            <br></br>
                            <div className='api_info'>
                                * API키는 사용자의 브라우저에 저장이 됩니다. 데이터 베이스에 별도로 저장이 되지 않으니 걱정 안 하셔도 됩니다.
                            </div>
                            <div>
                                <div>
                                    <div className='toggle_info' onClick={() => setToggleUpbit((prev) => !prev)}>
                                        업비트 API KEY 발급 설명 {toggleUpbit ? '접기' : '펼치기'}
                                    </div>
                                    {
                                        toggleUpbit ? (
                                            <UpbitApiInfo/>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <div className='toggle_info'>
                                        <a href='https://www.bithumb.com/customer_support/info_guide?seq=1901&categorySeq=205' target='blank'>
                                            빗썸 API Key 발급 설명 보기
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <style jsx>{`
                            div{
                                margin-left: 10px;
                            }
                            .api_info{
                                color: blue;
                            }
                            .toggle_info{
                                margin-top: 10px;
                            }
                            .toggle_info:hover{
                                color: #F5AC1E;
                                cursor: pointer;
                            }
                        `}</style>
                    </>
                )
            }
            
        </>
    )
}