package com.zzkun.Util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;

@Slf4j
public class NasHttpUtil {

    private static final MediaType JSON_TYPE = MediaType.parse("application/json; charset=utf-8");
    private static final OkHttpClient CLIENT = new OkHttpClient();

    private static final String CALL_ADDRESS = "https://testnet.nebulas.io/v1/user/call";
    private static final String USER_ADDRESS = "n1Vx6iSFM12aJWZw7Q9nTNsDWaX16kXrtsG";
    private static final String DAPP_ADDRESS = "n1tV65X8J5jvxMu86cxBqFJE9fz6HhCLfwD";

    public static String toLong(String shortUrl) {
        try {
            JSONObject contract = new JSONObject()
                    .fluentPut("args", String.format("[\"%s\"]", shortUrl))
                    .fluentPut("function", "toLong");
            JSONObject jsonParam = new JSONObject()
                    .fluentPut("from", USER_ADDRESS)
                    .fluentPut("to", DAPP_ADDRESS)
                    .fluentPut("value", "0")
                    .fluentPut("nonce", 0)
                    .fluentPut("gasPrice", "1000000")
                    .fluentPut("gasLimit", "2000000")
                    .fluentPut("contract", contract);
            // System.out.println(JSON.toJSONString(jsonParam, SerializerFeature.PrettyFormat));

            RequestBody body = RequestBody.create(JSON_TYPE, jsonParam.toJSONString());
            Request request = new Request.Builder()
                    .url(CALL_ADDRESS)
                    .post(body)
                    .build();
            Response response = CLIENT.newCall(request).execute();
            String respStr = response.body().string();
            String resultStr = JSON.parseObject(respStr).getJSONObject("result").getString("result");
            return JSON.parseObject(resultStr).getString("long");
        } catch (Exception e) {
            log.error("call toLong exception", e);
        }
        return null;
    }

    public static void main(String[] args) {
        System.out.println(toLong("1"));
    }
}
