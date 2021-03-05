from flask import jsonify, request
from flask_restful import Resource
from app.apis.v1 import api_v1
from flask_jwt_extended import jwt_required


import time
from datetime import datetime, timedelta
import random


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
        col_traffic = "{:.2f}".format(random.randint(50000, 100000000) / 1024 / 1024)  # 转换成 mb 精确小数点后2位
        col_concurrent = random.randint(500, 3000) 
        temp_list.append([col_dt, col_traffic, col_concurrent])
    return temp_list

def fake_category_agg():
    temp_list = []
    reason_code = ['code-execution', 'info-leak', 'dos', 'sql-injection']
    for i in reason_code:
        temp_list.append({'name': i, 'value': random.randint(10, 300)})

    return temp_list

def fake_category_detail():
    temp_list = []
    reason_code = ['邮件营销', '联盟广告', '视频广告']
    for i in reason_code:
        temp_list.append({'name': i, 'value': random.randint(10, 300)})

    return temp_list

class BasicChart(Resource):

    def get(self, chart_type):

        x_data = []
        data = {}
        if 'stack_line' in chart_type:
            x_data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            data = {
                '邮件营销': [120, 132, 101, 134, 90, 230, 210],
                '联盟广告': [220, 182, 191, 234, 290, 330, 310],
                '视频广告': [150, 232, 201, 154, 190, 330, 410]
            }
        if 'bar' in chart_type:
            x_data = ['10', '11', '12', '13', '14', '15', '16']
            data = {
                '邮件营销': [120, 132, 101, 134, 90, 230, 210],
                '视频广告': [150, 232, 201, 154, 190, 330, 410]
            }
        if 'line' in chart_type:
            x_data = ['周一', '周二', '周三', '周四', '周五']
            data = {
                '邮件营销': [120, 132, 101, 134, 90],
                '联盟广告': [220, 182, 191, 234, 290],
                '视频广告': [150, 232, 201, 154, 190]
            }

        time.sleep(3)
        return jsonify({
            'category': x_data,
            'data':data
        }) 

# index
api_v1.add_resource(Index, '/')
api_v1.add_resource(HealthCheck, '/hc')
api_v1.add_resource(BasicChart, '/chart/basic/<string:chart_type>')

