from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yfinance as yf
import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VolResponse(BaseModel):
    symbol: str
    window: int
    rmse: float
    dates: list[str]
    actual: list[float]
    predicted: list[float]
    title: str

@app.get("/api/volatility", response_model=VolResponse)
def get_volatility(
    symbol: str = Query(...),
    window: int = Query(10, ge=2, le=60),
    start: str = Query("2015-01-01"),
    end: str = Query("2025-01-01"),
):
    data = yf.download(symbol, start=start, end=end, progress=False)
    if data.empty:
        raise HTTPException(status_code=404, detail="No data returned for this symbol/time range")

    data['log_ret'] = np.log(data['Close'] / data['Close'].shift(1))
    data['volatility'] = data['log_ret'].rolling(window).std() * np.sqrt(252)
    data['ret_lag1'] = data['log_ret'].shift(1)
    data['ret_lag2'] = data['log_ret'].shift(2)
    data['vol_lag1'] = data['volatility'].shift(1)
    data['vol_lag2'] = data['volatility'].shift(2)
    data = data.dropna()
    if len(data) < 200:
        raise HTTPException(status_code=422, detail="Not enough data after feature engineering")

    X = data[['ret_lag1', 'ret_lag2', 'vol_lag1', 'vol_lag2']]
    y = data['volatility']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, shuffle=False)

    model = XGBRegressor(n_estimators=200, max_depth=3, learning_rate=0.05)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))

    return VolResponse(
        symbol=symbol,
        window=window,
        rmse=rmse,
        dates=[d.strftime("%Y-%m-%d") for d in y_test.index],
        actual=[float(v) for v in y_test.values],
        predicted=[float(v) for v in y_pred],
        title=f"Volatility Prediction ({symbol}, {window}-day Rolling)"
    )
