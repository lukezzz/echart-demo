from flask import jsonify, request
from flask_restful import Resource
from app.apis.v1 import api_v1
from flask_jwt_extended import jwt_required
from app.apis.v1.schemas import *

import time
from datetime import datetime, timedelta
import random
import requests


class Index(Resource):

    @jwt_required
    def get(self):
        return jsonify({
            "api_version": "1.0.1",
            "api_base_url": "{}".format(request.url_root),
            "current_user_url": "{}user".format(request.base_url),
            "authentication_url": "{}token".format(request.base_url),
            # "item_url": "{}/items/{{item_id}}".format(request.base_url),
        })


class HealthCheck(Resource):

    def get(self):
        return jsonify({
            "status": "OK"
        })


def perdelta(start, end, delta):
    curr = start
    while curr < end:
        yield curr
        curr += delta


def fake_timeline():
    temp_list = []
    start = datetime.now() - timedelta(hours=5)
    end = datetime.now()
    delta = timedelta(seconds=60)
    for result in perdelta(start, end, delta):
        col_dt = result.strftime('%Y-%m-%d %H:%M:%S')
        col_traffic = "{:.2f}".format(random.randint(
            50000, 100000000) / 1024 / 1024)  # 转换成 mb 精确小数点后2位
        col_concurrent = random.randint(500, 3000)
        temp_list.append([col_dt, col_traffic, col_concurrent])
    return temp_list


def random_x_data():
    temp_list = {
        1: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        2: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        3: ['周一', '周二', '周三', '周四', '周五'],
        4: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
    return temp_list[random.randint(1, 1)]


def random_category():
    temp_list = {
        1: ['邮件营销', '联盟广告', '视频广告'],
        2: ['销量'],
    }
    return temp_list[random.randint(1, 1)]


def random_data(x_data, category):
    d_length = len(x_data)
    data = {}

    for i in category:
        data[i] = random.sample(range(30, 1000), d_length)

    return data


def fixed_data(x_data, category):
    d_length = len(x_data)
    data = {}

    for i in category:
        data[i] = list(range(11, 17))

    return data


def basic_type1():
    x_data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    category = ['value']
    return line_schema(x_data, random_data(x_data, category))


def basic_type2():
    x_data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    category = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    return line_schema(x_data, random_data(x_data, category))


def basic_type3():
    # return dataset
    res = requests.get(
        url='https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/life-expectancy-table.json')
    data = res.json()
    return data


class BasicChart(Resource):

    def get(self, chartType):

        if chartType == 'type1':
            return basic_type1()

        if chartType == 'type2':
            return basic_type2()

        if chartType == 'type3':
            return basic_type3()

        # xAxis data
        x_data = random_x_data()
        # dataset
        category = random_category()
        data = random_data(x_data, category)

        # time.sleep(random.randint(0, 2))
        # time.sleep(3)
        return line_schema(x_data, data)

class TopoData(Resource):

    def get(self):
        nodes = [
            { "id": 0, "x": 285, "y": 2, "name": "router", "label": 'test', "icon": "router", "color": "#fff" },
            { "id": 1, "x": 410, "y": 280, "name": "switch", "icon": "switch" },
            { "id": 2, "x": 660, "y": 280, "name": "server", "icon": "server" },
            { "id": 3, "x": 660, "y": 100, "name": "host", "icon": "host" },
            { "id": 4, "x": 141, "y": 190, "name": "cloud", "icon": "cloud" },
            { "id": 5, "x": 444, "y": -58, "name": "F5", "icon": "f5" },
            { "id": 6, "x": 333, "y": -58, "name": "F5", "icon": "f5" },
            { "id": 7, "x": 521, "y": -88, "name": "ElasticSearch", "icon": "elasticsearch" },
        ]
        links = [
            { "source": 0, "target": 1, "id": 1 },
            { "source": 0, "target": 1, "id": 2 },
            { "source": 0, "target": 1, "id": 3 },
            { "source": 0, "target": 1, "id": 4 },
            { "source": 1, "target": 2, "id": 5 },
            { "source": 1, "target": 3, "id": 6 },
            { "source": 4, "target": 1, "id": 7 },
            { "source": 2, "target": 3, "id": 8 },
            { "source": 2, "target": 0, "id": 9 },
            { "source": 3, "target": 0, "id": 10 },
            { "source": 3, "target": 0, "id": 11 },
            { "source": 0, "target": 4, "id": 12 },
            { "source": 0, "target": 4, "id": 13 },
            { "source": 0, "target": 3, "id": 14 },
            { "source": 5, "target": 4, "id": 15 },
        ]

        return { "nodes": nodes, "links": links}




# index
api_v1.add_resource(Index, '/')
api_v1.add_resource(HealthCheck, '/hc')
api_v1.add_resource(BasicChart, '/chart/basic/<string:chartType>')
api_v1.add_resource(TopoData, '/topo/data')
