# 밴딩머신

상품을 고르고 구매할 수 있는 웹 자판기 서비스입니다.
<br>
<br>
[🔗벤딩머신 바로가기](https://kimhayeon1.github.io/vending-machine/)
<br>
<br>
## 기능

#### 1. 상품을 클릭하여, 장바구니에 추가 및 삭제할 수 있다.

#### 2. 장바구니

- 최대 구매 가능한 개수까지만 구매 가능하다.
- 재고 이상의 수량을 구매할 수 없다.
- 유효하지 않은 값이 입력되면 안내창을 띄운다. (빈값, 숫자외)
- 1 미만의 숫자가 입력되면 안내창을 띄운다.

#### 3. 획득 버튼

- 장바구니 상품 총금액이 잔액보다 크면, 부족한 액수를 알려준다.
- 획득한 음료에 상품이 있는 경우 : 해당 상품의 수량 변경
- 없는 경우 : 해당 상품 추가
- 장바구니는 비워져야 한다.
- 상품이 선택된 상태도 모두 취소되어야 한다.

#### 4. 입금 버튼

- 입금액이 없으면 alert 띄우기
- 입금액 < 소지금 : alert
- 잔액 += 입금액
- 소지금 -= 입금액

#### 5. 품절 상품 표시

#### 4. 거스름돈 반환

- 잔액이 있을 때
