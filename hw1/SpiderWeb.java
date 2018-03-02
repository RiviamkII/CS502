package com.hw1;

import org.jsoup.Jsoup;
import org.jsoup.helper.StringUtil;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.*;

public class SpiderWeb {
    public static void getReachableUrl (String root, int n, int timeOut) throws IOException {
        LinkedList<String> urlList = new LinkedList<>();
        LinkedList<String> visitedUrl = new LinkedList<>();
        urlList.add(root);
            while(!urlList.isEmpty() && urlList.size() + visitedUrl.size() < n){//bsf
                    String currentUrl = urlList.poll();
                    visitedUrl.add(currentUrl);
                    Document doc = Jsoup.connect(currentUrl).timeout(timeOut).followRedirects(true).get();
                    Elements anchors = doc.select("a");
                    for(Element element : anchors){
                        String curAbsUrl = element.absUrl("href");
                        if (StringUtil.isBlank(curAbsUrl)){
                            curAbsUrl = element.baseUri();
                        }
                        int fragIndex = curAbsUrl.indexOf("#");
                        if(fragIndex >= 0){
                            curAbsUrl = curAbsUrl.substring(0,fragIndex);
                        }
                        if(!urlList.contains(curAbsUrl) && !visitedUrl.contains(curAbsUrl)){//deal with duplicated url
                            urlList.add(curAbsUrl);
                        }
                    }
            }
        visitedUrl.addAll(urlList);
        int count = 0;
        PriorityQueue<String> sortVisitedUrl = new PriorityQueue<>(visitedUrl.size());
        while(count < n && !visitedUrl.isEmpty()){
            sortVisitedUrl.offer(visitedUrl.poll());
            count++;
        }
        while(!sortVisitedUrl.isEmpty()){
            String curUrl = sortVisitedUrl.poll();
            System.out.println(getUrlWithoutQuery(curUrl));
            for(String key:sortQuery(curUrl).keySet()){
                System.out.println("\t" + key + ", " + sortQuery(curUrl).get(key));
            }
        }
    }

    public static String getUrlWithoutQuery(String url){
        url = url.trim().toLowerCase();
        String urlWithoutQuery = url;
        String[] splitUrl = url.split("[?]");
        if(splitUrl.length > 1){
            if(splitUrl[0] != null){
                urlWithoutQuery = splitUrl[0];
            }
        }
        return urlWithoutQuery;
    }

    public static Map<String,String> sortQuery(String url){
        Map<String,String> queryMap = new TreeMap<>();
        String queryPara = null;
        String[] splitUrl = url.split("[?]");
        if(splitUrl.length > 1){
            if(splitUrl[1] != null){
                queryPara = splitUrl[1];
            }
        }
        if(queryPara == null){
            return queryMap;
        }
        String[] splitQueryPara = queryPara.split("[&]");
        for(String paras : splitQueryPara){
            String[] eachPara = paras.split("[=]");
            if(eachPara.length>1){
                queryMap.put(eachPara[0],eachPara[1]);
            }else{
                queryMap.put(eachPara[0],"");
            }
        }
        return queryMap;
    }

    public static void main(String[] args) throws IOException {
            String root = args[0];
            int n = Integer.parseInt(args[1]);
            int timeOut = Integer.parseInt(args[2]);
            if(!root.startsWith("http") && !root.startsWith("https")){
                throw new IllegalArgumentException("The scheme must be either \"http\" or \"https\".");
            }else if(n<1 || n>10000){
                throw new IllegalArgumentException("N must be in the interval [1, 10000].");
            }else if(timeOut<1 || timeOut>10000){
                throw  new IllegalArgumentException("Timeout must be in the interval [1, 10000].");
            }
            getReachableUrl(root,n,timeOut);
    }
}