from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, fresh_jwt_required
)

from .database import init_db
from flask_cors import CORS
import requests
import time
import random
import json

from .models import *

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'mock_api'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 1800
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



jwt = JWTManager(app)
cors = CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:3000"}})

init_db(app)

def init_table():
    db.drop_all()
    db.creat_all()


    t_list = {
        "HFTH_Suspicious Response Code 400" : "拒绝非法尝试访问",
        "HFTH_Suspicious Response Code 403" : "拒绝非法扩展名访问",
        "HFTH_Suspicious Response Code 404" : "400code频率限制100/1min",
        "HFTH_mss.stg_api/SendShortmsgViaUserCode_15min_401" : "403code频率限制100/1min",
        "HFTH_mss.stg_api/SendShortmsgViaUserCode_1min_401" : "404code频率限制100/1min",
        "HFTH_mss.stg_api/SendShortmsgViaUserCode_5min_401" : "mss发短信验证码频率限制15/15min",
        "HFTH_mss.stg_api/login_15min_40" : "mss发短信验证码频率限制4/1min",
        "HFTH_mss.stg_api/login_1min_401" : "mss发短信验证码频率限制8/5min",
        "HFTH_mss.stg_api/login_30min_401" : "mss ad账号登录失败频率限制15/15min",
        "HFTH_mss.stg_api/login_5min_401" : "mss ad账号登录失败频率限制4/1min"

    }

    for k in t_list:
        item = WafAlias()
        item.policy_name = k
        item.policy_alias = t_list[k]
        db.session.add(item)
    db.session.commit()


from datetime import date, datetime, timedelta
def perdelta(start, end, delta):
    curr = start
    while curr < end:
        yield curr
        curr += delta

def convert_bytes(size):
    power = 2**10 #1024
    n = 0
    power_labels = {0:'', 1: 'KB', 2: 'MB', 3: 'GB', 4: 'TB'}
    while size > power:
        size /= power
        n += 1
    return round(size, 2), power_labels[n]

def daterange(d1, d2):
    for n in range(int ((d2 - d1).days) + 1):
        yield d1 + timedelta(n)

@app.route('/api/v1/user/authorization', methods=["POST"])
def AuthTokenAPI():

    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username:
        return jsonify({"message": "Missing username parameter"}), 400
    if not password:
        return jsonify({"message": "Missing password parameter"}), 400

    req_user = {'username': username, 'password':password}

    store_user = {'username': 'test', 'password':'12345'}

    if req_user is None or req_user['username'] == 'test2':
        return jsonify({"message": "User not permissions"}), 403

    if req_user is None or req_user['password'] != store_user['password']:
        return jsonify({"message": "Bad username or password"}), 401

    response = {
        'access_token': create_access_token(identity=username),
        'refresh_token': create_refresh_token(identity=username)
    }
    # response.headers['Cache-Control'] = 'no-store'
    # response.headers['Pragma'] = 'no-cache'
    return response

@app.route('/api/v1/user/authorization', methods=["GET"])
@jwt_required
def verify_auth():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify({'message':'Permission verification pass'})
    else:
        return jsonify({'message':'Permission verification block'}), 403

@app.route('/api/v1/user/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, fresh=False)
    ret = {'access_token': new_token}
    return jsonify(ret), 200


@app.route('/api/v1/dashboard/metric/day_aggs', methods=["POST"])
@jwt_required
def api_metric_day_aggs():
    # data = json.loads(request.get_data(as_text=True))
    data = request.get_json()
    if 'rate' in data["key"]:
        return {'sum': random.randint(70, 99), 'suffix': '%' }

    if 'ms' in data["key"] and 'avg' in data["key"]:
        return {'avg': random.randint(10, 1000), 'suffix': 'ms' }
    if 'ms' in data["key"] and 'max' in data["key"]:
        return {'max': random.randint(200, 9999), 'suffix': 'ms' }

    from faker import Faker
    faker = Faker()
    color = faker.safe_hex_color()
    if 'avg' in data['aggs']:
        return {'avg': random.randint(10, 1000), 'prefix': random.randint(0, 1), 'prefixColor': color}

    if data["key"] == 'funnel_sum_block_per_device':

        return {
            'sum': [
                { 'data["key"]': random.randint(1000, 20000), 'name': 'Shape' },
                { 'data["key"]': random.randint(2000, 30000), 'name': 'WAF' },
                { 'data["key"]': random.randint(3000, 40000), 'name': 'PA_FW' },
            ], 
            'block': [
                { 'data["key"]': random.randint(1, 45), 'name': 'Shape' },
                { 'data["key"]': random.randint(1, 32), 'name': 'WAF' },
                { 'data["key"]': random.randint(1, 12), 'name': 'PA_FW' },
            ]
        }

    if 'bytes' in data["key"]:
        traffic = random.randint(5000000, 1000000000)
        sum_traffic, suffix = convert_bytes(traffic)
        return { 'sum': sum_traffic, 'suffix': suffix}

    #time.sleep(random.randint(1,2))
    return {'sum': random.randint(500, 500000) }

@app.route('/api/v1/dashboard/metric/contrast', methods=["POST"])
@jwt_required
def api_metric_contrast():
    # data = json.loads(request.get_data(as_text=True))
    data = request.get_json()
   
    from faker import Faker
    faker = Faker()
    if 'avg' in data['aggs']:
        current_avg = random.randint(1, 3000)
        contrast_avg = random.randint(1, 3000)
        prefix = random.randint(0, 1)
        avg = abs(contrast_avg - current_avg)
        if prefix == 0:
            prefixColor = '#9BDEAC'
        else:
            if avg <= 100:
                prefixColor = '#EF7F5DD'
            elif avg <= 1000:
                prefixColor = '#E2979C'
            else:
                prefixColor = '#E7305B'

        from_contrast = faker.date_time().strftime("%Y-%m-%d %H:%M:%S")
        to_contrast = faker.date_time().strftime("%Y-%m-%d %H:%M:%S")
        from_current = faker.date_time().strftime("%Y-%m-%d %H:%M:%S")
        to_current = faker.date_time().strftime("%Y-%m-%d %H:%M:%S")

        if 'bytes' in data['key']:

            return {
                'current_avg': current_avg, 
                'avg': contrast_avg, 
                'prefix': prefix,
                'suffix': 'MB',
                'prefixColor': prefixColor,
                'from_contrast': from_contrast,
                'to_contrast': to_contrast,
                'from_current': from_current,
                'to_current': to_current
                }
        else:
            return {
                'current_avg': current_avg, 
                'avg': contrast_avg, 
                'prefix': prefix,
                'prefixColor': prefixColor,
                'from_contrast': from_contrast,
                'to_contrast': to_contrast,
                'from_current': from_current,
                'to_current': to_current
                }


    #time.sleep(random.randint(1,2))
    return {'sum': random.randint(500, 500000) }




@app.route('/api/v1/dashboard/metric/day_hour', methods=["POST"])
@jwt_required
def api_metric_day_hour():

    data = request.get_json()

    def fake_data():
        temp_dict = {}
        hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
        for i in range(random.randint(2, 23)):
            temp_dict[hours[i]] = random.randint(0, 500)
            # temp_list.append([hours[i], item, 0])

        return temp_dict
                
        

    def fake_data_dt(start_dt, end_dt):
        temp_dict = {}
        dt = []
        start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
        end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
        for day in daterange(start_dt, end_dt):
            # print(day.strftime("%Y-%m-%d"))
            d = day.strftime("%Y-%m-%d")
            for i in range(random.randint(0, 23)):
                d_h = d + ' ' + str(i)
                # temp_list.append([d_h, random.randint(0, 500)])
                temp_dict[d_h] = random.randint(0, 500)
        
        return temp_dict
    
    if 'from' in data and 'to' in data:
        dt_from = data['from']
        dt_to = data['to']
        return {
            data["key"]: fake_data_dt(dt_from, dt_to)
        }


    return {
        data["key"]: fake_data()
    }


@app.route('/api/v1/dashboard/chart/<category>', methods=["POST"])
@jwt_required
def api_chart(category):

    # data = json.loads(request.get_data(as_text=True))
    data = request.get_json()
    #time.sleep(random.randint(1,2))

    if 'rate' in data["key"]:
        return {'sum': random.randint(70, 99), 'suffix': '%' }

    if data["key"] == 'bar_block_rate':
        return {
            data["key"]: [
                { 'device': 'PA', 'Block': random.randint(100, 500), 'Total': random.randint(5000, 8000) },
                { 'device': 'WAF', 'Block': random.randint(50, 300), 'Total': random.randint(1000, 4000) },
                { 'device': 'SHAPE', 'Block': random.randint(70, 250), 'Total': random.randint(300, 900) }
            ]
                
        }

    if data["key"] == 'bar_block_count_by_device':
        return {
            data["key"]: [
                { 'device': 'PA_Threat', 'alert': random.randint(100, 500), 'drop': random.randint(5000, 8000), 'reset-server': random.randint(0, 0), 'reset-both': random.randint(200, 900), 'reset-client': random.randint(5000, 8000) },
                { 'device': 'WAF', 'alert': random.randint(50, 300), 'block': random.randint(1000, 4000) },
                { 'device': 'SHAPE', 'x_bot': random.randint(70, 250) }
            ]
                
        }

    if data["key"] == 'bar_pie_count_by_device_by_hour':
        return {
            data["key"]: [
                    ['device', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                    ['Login F5 Request', random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), ],
                    ['Login PA Threat', random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), ],
                    ['Login WAF', random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), ],
                    ['Login Shape', random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), random.randint(0, 1000), ],
            ]
        }

    if data["key"] == 'pie_count_block_by_device':
        return {
            data["key"]: [
                ['F5 Request', random.randint(0, 1000)],
                ['PA Threat', random.randint(0, 1000)],
                ['WAF', random.randint(0, 1000)],
                ['Shape', random.randint(0, 1000)],
            ]
        }

    if data["key"] == 'heatmap_block_count_by_device_by_hour':
        
        def fake_data(item):
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(2, 23)):
                temp_list.append([hours[i], item, random.randint(0, 500)])
                # temp_list.append([hours[i], item, 0])

            return temp_list
                
        

        def fake_data_dt(item, start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, item, random.randint(0, 500)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            # pa_traffic = fake_data_dt(0, dt_from, dt_to)
            pa_threat = fake_data_dt(0, dt_from, dt_to)
            waf = fake_data_dt(1, dt_from, dt_to)
            shape = fake_data_dt(2, dt_from, dt_to)
            return {
                'heatmap_block_count_by_device_by_hour': 
                pa_threat + waf + shape
            }

        # pa_traffic = fake_data(0)
        pa_threat = fake_data(0)
        waf = fake_data(1)
        shape = fake_data(2)
        return {
            'heatmap_block_count_by_device_by_hour': 
                pa_threat + waf + shape
        }

    if data["key"] == 'line_trend_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000), random.randint(0, 1500), random.randint(0, 500)])

            return temp_list

        # temp_list: ['12a', 200, 100, 50]
        # 200: f5_request sum
        # 100: f5_response sum
        # 50:  f5_response_time avg
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000), random.randint(0, 1500), random.randint(0, 500)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                'line_trend_by_hour': fake_data_dt(dt_from, dt_to)
            }
        return {
            'line_trend_by_hour': fake_data()
        }
    if data["key"] == 'line_request_response_traffic_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000), random.randint(0, 1500), random.randint(0, 100)])

            return temp_list

        # temp_list: ['12a', 200, 100, 50]
        # 200: f5_request sum
        # 100: f5_response sum
        # 50:  f5_traffic MB
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000), random.randint(0, 1500), random.randint(0, 500)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                data["key"]: fake_data_dt(dt_from, dt_to)
            }
        return {
            data["key"]: fake_data()
        }
    if data["key"] == 'Pa_bar_internet_traffic_by_hour' or data["key"] == 'Pa_bar_zjdc_traffic_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000), random.randint(0, 1500)])

            return temp_list

        # temp_list: ['12a', 200, 100, 50]
        # 200: f5_request sum
        # 100: f5_response sum
        # 50:  f5_traffic MB
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000), random.randint(0, 1500)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                 data["key"]: fake_data_dt(dt_from, dt_to)
            }
        return {
            data["key"]: fake_data()
        }

    if data["key"] == 'map_ip_count_by_hour':
        provinces = {
            '吉林省': [125.326800, 43.896160], '黑龙江省': [126.662850, 45.742080],
            '辽宁省': [123.429250, 41.835710], '内蒙古自治区': [111.765220, 40.817330],
            '新疆维吾尔自治区': [87.627100, 43.793430], '青海省': [101.780110, 36.620870],
            '北京市': [116.407170, 39.904690], '天津市': [117.199370, 39.085100],
            '上海市': [121.473700, 31.230370], '重庆市': [106.550730, 29.564710],
            '河北省': [114.469790, 38.035990], '河南省': [113.753220, 34.765710],
            '陕西省': [108.954240, 34.264860], '江苏省': [118.762950, 32.060710],
            '山东省': [117.020760, 36.668260], '山西省': [112.562720, 37.873430],
            '甘肃省': [103.826340, 36.059420], '宁夏回族自治区': [106.258670, 38.471170],
            '四川省': [104.075720, 30.650890], '西藏自治区': [91.117480, 29.647250],
            '安徽省': [117.285650, 31.861570], '浙江省': [120.153600, 30.265550],
            '湖北省': [114.342340, 30.545390], '湖南省': [112.983400, 28.112660],
            '福建省': [119.296590, 26.099820], '江西省': [115.910040, 28.674170],
            '贵州省': [106.707220, 26.598200], '云南省': [102.709730, 25.045300],
            '广东省': [113.266270, 23.131710], '广西壮族自治区': [108.327540, 22.815210],
            '香港': [114.165460, 22.275340], '澳门': [113.549130, 22.198750],
            '海南省': [110.348630, 20.019970], '台湾省': [121.520076, 25.030724]
            }

        def fake_list():
            temp_list = []
            for i in range(29):
                cp = random.choice(list(provinces))
                from faker import Faker
                faker = Faker()
                ip = faker.ipv4()
                data = {
                    "ip": ip,
                    "value": random.randint(0, 5000),
                    "cp": provinces[cp],
                    "name": 'test'
                }
                temp_list.append(data)
            return temp_list
            
        return {
            'map_ip_count_by_hour': {
                "Login_F5": fake_list(),
                "Login_WAF": fake_list(),
                "Login_Shape": fake_list(),
                "Register_F5": fake_list(),
                "Register_WAF": fake_list(),
                "Regiser_Shape": fake_list()
            }
        }

    if data["key"] == 'F5_line_traffic_concurrent_per_60_seconds':
        def fake_data():
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

        return {
            'F5_line_traffic_concurrent_per_60_seconds': fake_data()
        }

    if data["key"] == 'F5_bar_public_domain_by_request_top5' or data["key"] == 'F5_bar_public_uri_by_request_top5':
        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(5):
                domain = faker.domain_word() + '.hftech.com.cn'
                temp_list.append([domain, random.randint(500, 500000)])

            temp_list.sort(key=lambda x:x[1])
            return temp_list
    
        return {
            data["key"]: fake_data()
        }

    if data["key"] == 'F5_bar_public_domain_by_traffic_top5' or data["key"] == 'F5_bar_public_uri_by_traffic_top5':
        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(5):
                domain = faker.domain_word() + '.hftech.com.cn'
                traffic = "{:.2f}".format(random.randint(50000, 100000000) / 1024 / 1024)
                temp_list.append([domain, traffic])
                
            temp_list.sort(key=lambda x:x[1])
            return temp_list
    
        return {
            data["key"] : fake_data()
        }

    if data["key"] == 'F5_wordcloud_city_name_count':
        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(50):
                city = faker.city()
                data["key"] = str(random.randint(100, 10000))
                temp_list.append({ 'name': city, 'value': data["key"]})
    
            return temp_list
        return {
            'F5_wordcloud_city_name_count': fake_data()
        }

    if data["key"] == 'Pa_traffic_actions_count_per_hour':
        hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

        def fake_data():
            temp_list = []
            for i in range(24):
                session_count = random.randint(0, 50000)
                temp_list.append(session_count)

            return temp_list
        # actions_list = ['allow', 'block', 'deny', 'drop', 'reset-both', 'reset-client', 'reset-server']
        return {
            'Pa_traffic_actions_count_per_hour': 
            [
                hours,
                ['allow'] + fake_data(),
                ['block'] + fake_data(),
                ['deny'] + fake_data(),
                ['drop'] + fake_data()
            ]
        }

    if data["key"] == 'Pa_threat_actions_count_per_hour':
        hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

        def fake_data():
            temp_list = []
            for i in range(24):
                session_count = random.randint(0, 50000)
                temp_list.append(session_count)

            return temp_list
        # actions_list = ['alert', 'block', 'drop']
        return {
            'Pa_threat_actions_count_per_hour': 
            [
                hours,
                ['alert'] + fake_data(),
                ['block'] + fake_data(),
                ['drop'] + fake_data()
            ]
        }
    
    if data["key"] == 'Pa_traffic_blocked_by_policy_group_by_name':
        def fake_data():
            temp_list = []
            from faker import Faker
            faker = Faker()
            for i in range(random.randint(4, 10)):
                temp_list.append({'name': faker.domain_word(), 'value' :random.randint(100, 10000)})

            sorted_list = sorted(temp_list, key=lambda x: x['value'])
            return sorted_list
        return {
            'Pa_traffic_blocked_by_policy_group_by_name': fake_data()
        }

    if data["key"] == 'Pa_threat_blocked_by_policy_group_by_name':
        def fake_data():
            temp_list = []
            from faker import Faker
            faker = Faker()
            for i in range(random.randint(4, 10)):
                temp_list.append({'name': faker.domain_word(), 'value' :random.randint(100, 10000)})

            sorted_list = sorted(temp_list, key=lambda x: x['value'])
            return sorted_list
        #time.sleep(5)
        return {
            'Pa_threat_blocked_by_policy_group_by_name': fake_data()
        }

    if data["key"] == 'Pa_pie_threatCategory':

        def fake_data():
            from faker import Faker
            temp_list = []
            reason_code = ['code-execution', 'info-leak', 'dos', 'sql-injection']
            for i in reason_code:
                temp_list.append({'name': i, 'value': random.randint(10, 300)})

            return temp_list

        return {
            data["key"] : fake_data()
        }

    if data["key"] == 'Pa_pie_threatID':

        def fake_data():
            from faker import Faker
            temp_list = []
            reason_code = ['Generic HTTP Cross', 'Cisco adaptive...', 'ZGrab applicionat..', 'HTTP Cross-site scripting', 'ThinkPIP Remote Code Execution']
            for i in reason_code:
                temp_list.append({'name': i, 'value': random.randint(10, 300)})

            return temp_list

        return {
            data["key"] : fake_data()
        }

    if data["key"] == 'Pa_bar_threat_miscellaneous_top10':
        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(10):
                domain = faker.domain_word() + faker.domain_word() + '.hftech.com.cn'
                temp_list.append([domain, random.randint(500, 5000)])

            temp_list.sort(key=lambda x:x[1])
            return temp_list
    
        return {
            data["key"]: fake_data()
        }


    if data["key"] == 'Waf_trend_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000), random.randint(0, 1500), random.randint(200, 3000)])

            return temp_list

        # temp_list: ['12a', 200, 100, 300]
        # 200: block sum
        # 100: alert sum
        # 300:  total 
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000), random.randint(0, 1500), random.randint(200, 3000)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                'Waf_trend_by_hour': fake_data_dt(dt_from, dt_to),
                'avg': random.randint(300, 5000)
            }
        return {
            'Waf_trend_by_hour': fake_data(),
            'avg': random.randint(300, 5000)
        }

    if data["key"] == 'Waf_block_source_ip':

        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(random.randint(5, 30)):
                ip = faker.ipv4()
                temp_list.append({'name': ip, 'value': random.randint(10, 300)})

            return temp_list

        return {
            'Waf_block_source_ip': fake_data()
        }

    if data["key"] == 'Waf_attack_block_count' or data["key"] == 'Waf_attack_alert_count':
        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(random.randint(5, 30)):
                name = faker.domain_word()
                temp_list.append({'name': name, 'value': random.randint(10, 300)})

            return temp_list

        return {
            data["key"]: fake_data()
        }


    if data["key"] == 'Waf_reason_code':

        def fake_data():
            from faker import Faker
            temp_list = []
            reason_code = ['200', '404', '500', '302', '400']
            for i in reason_code:
                temp_list.append({'name': i, 'value': random.randint(10, 300)})

            return temp_list

        return {
            'Waf_reason_code': fake_data()
        }

    if data["key"] == 'Waf_table_uri_count':

        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(random.randint(20, 50)):
                uri = faker.domain_word()
                temp_list.append({'key': i, 'uri': uri, 'count': random.randint(10, 300)})

            sorted_list = sorted(temp_list, key=lambda x: x['count'], reverse=True)
            return sorted_list

        return {
            'Waf_table_uri_count': fake_data()
        }


    if data["key"] == 'Shape_trend_by_hour' or \
     data["key"] == 'Shape_login_trend_by_hour' or \
     data["key"] == 'Shape_register_trend_by_hour' or \
     data["key"] == 'Shape_v2_cards_trend_by_hour' or \
     data["key"] == 'Shape_v2_cards_detail_trend_by_hour' or \
     data["key"] == 'Shape_v2_cards_msr_detail_trend_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000), random.randint(0, 1500)])

            return temp_list

        # temp_list: ['12a', 200, 100, 300]
        # 200: block sum
        # 100: alert sum
        # 300:  total 
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000), random.randint(0, 1500)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                data["key"]: fake_data_dt(dt_from, dt_to)
            }
        return {
            data["key"]: fake_data()
        }

    if data["key"] == 'Shape_phone_type':

        def fake_data():
            
            temp_list = []
            phone_type = ['ios', 'android', 'other']
            for i in phone_type:
                temp_list.append({'name': i, 'value': random.randint(10, 300)})

            return temp_list

        return {
            'Shape_phone_type': fake_data()
        }

    if data["key"] == 'Shape_app_version':

        def fake_data():
            
            temp_list = []
            phone_type = ['v1.0', 'v2.0', 'v3.0']
            for i in phone_type:
                temp_list.append({'name': i, 'value': random.randint(10, 300)})

            return temp_list

        return {
            data["key"]: fake_data()
        }

    if data["key"] == 'Shape_block_source_ip':

        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(random.randint(5, 30)):
                ip = faker.ipv4()
                temp_list.append({'name': ip, 'value': random.randint(10, 300)})

            return temp_list

        return {
            'Shape_block_source_ip': fake_data()
        }


    if data["key"] == 'Pa_table_threat_details':

        def fake_data():
            from faker import Faker
            faker = Faker()
            
            temp_list = []
            for i in range(random.randint(12, 50)):
                src_ip = faker.ipv4()
                dst_ip = faker.ipv4()
                threat_category = faker.job()
                threat_id = faker.job()
                count = random.randint(10, 3000)
                temp_list.append(
                    {
                        'key': i, 
                        'src_ip': src_ip, 
                        'dst_ip': dst_ip, 
                        'threat_category':threat_category,
                        'threat_id': threat_id,
                        'count': count
                        }
                    )

            # sorted_list = sorted(temp_list, key=lambda x: x['count'], reverse=True)
            return temp_list

        return {
            'Pa_table_threat_details': fake_data()
        }
    if data["key"] == 'Waf_table_violation_details':

        def fake_data():
            from faker import Faker
            faker = Faker()
            
            temp_list = []
            for i in range(random.randint(5, 30)):
                src_ip = faker.ipv4()
                dst_ip = faker.ipv4()
                violation_desc = faker.job()
                action = ['alert', 'block']
                count = random.randint(10, 3000)
                temp_list.append(
                    {
                        'key': i, 
                        'src_ip': src_ip, 
                        'dst_ip': dst_ip, 
                        'violation_desc':violation_desc,
                        'action': action[random.randint(0,1)],
                        'count': count
                        }
                    )

            # sorted_list = sorted(temp_list, key=lambda x: x['count'], reverse=True)
            return temp_list

        return {
            'Waf_table_violation_details': fake_data()
        }
    if data["key"] == 'Shape_table_fraud_details':

        def fake_data():
            from faker import Faker
            faker = Faker()
            from fake_useragent import UserAgent
            ua = UserAgent(verify_ssl=False)
            temp_list = []
            for i in range(random.randint(5, 30)):
                src_ip = faker.ipv4()
                dst_ip = faker.ipv4()
                xbot_type = faker.job()
                phone_type = ['IOS', 'Android', 'other']
                url = faker.domain_word()
                action = ['alert', 'block']
                count = random.randint(10, 3000)
                temp_list.append(
                    {
                        'key': i, 
                        'src_ip': src_ip, 
                        'xbot_type': xbot_type, 
                        'phone_type':phone_type[random.randint(0, 2)],
                        'url': url,
                        'user_agent': ua.random,
                        'count': count
                        }
                    )

            # sorted_list = sorted(temp_list, key=lambda x: x['count'], reverse=True)
            return temp_list

        return {
            'Shape_table_fraud_details': fake_data()
        }

    if data["key"] == 'Shape_table_user_agent_count':

        def fake_data():
            from fake_useragent import UserAgent
            ua = UserAgent(verify_ssl=False)
            temp_list = []
            for i in range(random.randint(5, 10)):
                temp_list.append({'key': i, 'agent': ua.random, 'count': random.randint(10, 300)})

            sorted_list = sorted(temp_list, key=lambda x: x['count'], reverse=True)
            return sorted_list

        return {
            'Shape_table_user_agent_count': fake_data()
        }


    if data["key"] == 'map_ip_count_by_hour_fake':
        provinces = {
            '吉林省': [125.326800, 43.896160], '黑龙江省': [126.662850, 45.742080],
            '辽宁省': [123.429250, 41.835710], '内蒙古自治区': [111.765220, 40.817330],
            '新疆维吾尔自治区': [87.627100, 43.793430], '青海省': [101.780110, 36.620870],
            '北京市': [116.407170, 39.904690], '天津市': [117.199370, 39.085100],
            '上海市': [121.473700, 31.230370], '重庆市': [106.550730, 29.564710],
            '河北省': [114.469790, 38.035990], '河南省': [113.753220, 34.765710],
            '陕西省': [108.954240, 34.264860], '江苏省': [118.762950, 32.060710],
            '山东省': [117.020760, 36.668260], '山西省': [112.562720, 37.873430],
            '甘肃省': [103.826340, 36.059420], '宁夏回族自治区': [106.258670, 38.471170],
            '四川省': [104.075720, 30.650890], '西藏自治区': [91.117480, 29.647250],
            '安徽省': [117.285650, 31.861570], '浙江省': [120.153600, 30.265550],
            '湖北省': [114.342340, 30.545390], '湖南省': [112.983400, 28.112660],
            '福建省': [119.296590, 26.099820], '江西省': [115.910040, 28.674170],
            '贵州省': [106.707220, 26.598200], '云南省': [102.709730, 25.045300],
            '广东省': [113.266270, 23.131710], '广西壮族自治区': [108.327540, 22.815210],
            '香港': [114.165460, 22.275340], '澳门': [113.549130, 22.198750],
            '海南省': [110.348630, 20.019970], '台湾省': [121.520076, 25.030724]
            }

        def fake_list():
            temp_list = []
            for i in range(29):
                cp = random.choice(list(provinces))
                from faker import Faker
                faker = Faker()
                ip = faker.ipv4()
                data = {
                    "ip": ip,
                    "value": random.randint(0, 5000),
                    "cp": provinces[cp],
                    "name": 'test'
                }
                temp_list.append(data)
            return temp_list
            
        return {
                data["key"]: fake_list(),
            }

    if data["key"] == 'bluecoat_cipher_status':
        def fake_data():
            status_list = ['success',
                        'reject']
            temp_list = []
            for i in status_list:
                temp_list.append({'name': i, 'value': random.randint(10, 1000)})
            return temp_list

        return {
            data["key"]: fake_data()
        }

    if data["key"] == 'bluecoat_cipher_suite':
        def fake_data():
            status_list = ['TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
                    '---',
                    'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
                    'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
                    'TLS_RSA_WITH_AES_128_CBC_SHA256',
                    'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
                    'TLS_DHE_RSA_WITH_AES_256_CBC_SHA',
                    'TLS_DHE_RSA_WITH_AES_128_GCM_SHA256',
                    'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',]
            temp_list = []
            for i in status_list:
                temp_list.append({'name': i, 'value': random.randint(10, 1000)})
            return temp_list

        return {
            data["key"]: fake_data()
        }

    if data["key"] == 'bluecoat_cipher_success_failed_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000), random.randint(0, 1500)])

            return temp_list

        # temp_list: ['12a', 200, 100, 50]
        # 200: f5_request sum
        # 100: f5_response sum
        # 50:  f5_traffic MB
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000), random.randint(0, 1500)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                data["key"]: fake_data_dt(dt_from, dt_to)
            }
        return {
            data["key"]: fake_data()
        }
    
    if data["key"] == 'bluecoat_cipher_request_by_hour':
        def fake_data():
            temp_list = []
            hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            for i in range(random.randint(0, 23)):
                temp_list.append([hours[i], random.randint(0, 2000)])

            return temp_list

        # temp_list: ['12a', 200, 100, 50]
        # 200: f5_request sum
        # 100: f5_response sum
        # 50:  f5_traffic MB
            
        

        def fake_data_dt(start_dt, end_dt):
            temp_list = []
            dt = []
            start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
            for day in daterange(start_dt, end_dt):
                # print(day.strftime("%Y-%m-%d"))
                d = day.strftime("%Y-%m-%d")
                for i in range(random.randint(0, 23)):
                    d_h = d + ' ' + str(i)
                    temp_list.append([d_h, random.randint(0, 2000)])
            
            return temp_list
        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                data["key"]: fake_data_dt(dt_from, dt_to)
            }
        return {
            data["key"]: fake_data()
        }
    
    if data["key"] == "bluecoat_map_cipher_group_by_status_world":
        def data_list():
            from faker import Faker
            faker = Faker()
            d = []
            for i in range(random.randint(30, 30)):
                data = faker.location_on_land()
                d.append({
                    'location': data[3] + ' ' + data[2],
                    'cp': [data[1], data[0], random.randint(1, 60000)]
                })
            return d
        def fake_list():
            d = {}
            d["加解密成功"] = data_list()
            d["加解密失败"] = data_list()

            return d

        return {
                data["key"]: fake_list(),
            }


    if data["key"] == "bluecoat_map_cipher_group_by_status_china":
        def data_list():
            from faker import Faker
            faker = Faker()
            d = []
            for i in range(random.randint(35, 35)):
                data = faker.local_latlng(country_code='CN')
                d.append({
                    'location': data[3] + ' ' + data[2],
                    'cp': [data[1], data[0], random.randint(1, 300)]
                })
            return d
        def fake_list():
            d = {}
            d["加解密成功"] = data_list()
            d["加解密失败"] = data_list()

            return d

        return {
                data["key"]: fake_list(),
            }

    if data["key"] == 'bluecoat_cipher_success_top10_ip' or data["key"] == 'bluecoat_cipher_failed_top10_ip':    

        def fake_data():
            from faker import Faker
            faker = Faker()
            temp_list = []
            for i in range(random.randint(10, 10)):
                ip = faker.ipv4()
                temp_list.append({'name': ip, 'value': random.randint(10, 300)})

            sorted_list = sorted(temp_list, key=lambda x: x['value'])

            return sorted_list

        return {
            data["key"]: fake_data()
        }



    if 'world' in data["key"]:
        def data_list():
            from faker import Faker
            faker = Faker()
            d = []
            for i in range(random.randint(30, 30)):
                data = faker.location_on_land()
                d.append({
                    'location': data[3] + ' ' + data[2],
                    'cp': [data[1], data[0], random.randint(1, 60000)]
                })
            return d
        def fake_list():
            d = {}
            # d["pa_traffic"] = data_list()
            d["pa_threat"] = data_list()
            d["waf"] = data_list()
            d["shape"] = data_list()

            return d

        return {
                data["key"]: fake_list(),
            }
    if 'china' in data["key"]:
        def data_list():
            from faker import Faker
            faker = Faker()
            d = []
            for i in range(random.randint(15, 45)):
                data = faker.local_latlng(country_code='CN')
                d.append({
                    'location': data[3] + ' ' + data[2],
                    'cp': [data[1], data[0], random.randint(1, 300)]
                })
            return d
        def fake_list():
            d = {}
            # d["pa_traffic"] = data_list()
            d["pa_threat"] = data_list()
            d["waf"] = data_list()
            d["shape"] = data_list()

            return d

        return {
                data["key"]: fake_list(),
            }

    return None


@app.route('/api/v1/dashboard/edl/metric', methods=["POST"])
@jwt_required
def api_edl_metric():

    url = 'http://127.0.0.1:5010/edl/api/v1/dashboard/metric'
    data = request.get_json()
    r = requests.post(url, json=data)


    return(r.json())

@app.route('/api/v1/dashboard/edl/chart', methods=["POST"])
@jwt_required
def api_edl_chart():

    url = 'http://127.0.0.1:5010/edl/api/v1/dashboard/chart'
    data = request.get_json()
    r = requests.post(url, json=data)


    return(r.json())


@app.route('/api/v1/management/waf_policy_alias_list', methods=["GET"])
@jwt_required
def waf_policy_alias_list():

    #time.sleep(1)

    items = WafAlias.query.all()
    temp_list = []
    for item in items:
        temp_list.append({'key': item.key, 'policy_name': item.policy_name, 'policy_alias': item.policy_alias})

    return { 'waf_policy_alias_list': temp_list}


@app.route('/api/v1/management/waf_policy_alias', methods=['GET', 'POST', 'PUT', 'DELETE'])
@jwt_required
def waf_policy_alias():

    #time.sleep(1)

    data = request.get_json()

    if 'key' in data:
        try:
            return WafAlias.get_delete_put_post(data['key'])
        except Exception as e:
            print(e)
            return {'message': 'failed'}, 500
    else:
        try:
            return WafAlias.get_delete_put_post()
        except Exception as e:
            print(e)
            return {'message': 'Alias add failed'}, 500

@app.route('/api/v1/analysis/metric/history_comparison', methods=["POST"])
@jwt_required
def api_history_comparision():
    # data = json.loads(request.get_data(as_text=True))
    data = request.get_json()
    
    def fake_data_dt(start_dt, end_dt):
        temp_dict = {}
        dt = []
        days_list = []
        temp_list = []
        start_dt = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
        end_dt = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')
        for day in daterange(start_dt, end_dt):
            # print(day.strftime("%Y-%m-%d"))
            d = day.strftime("%Y-%m-%d")
            days_list.append(d)

        for idx, v in enumerate(days_list):
            for i in range(random.randint(24, 24)):
                temp_list.append([i,idx, random.randint(50, 1000)])

        temp_dict['hours'] = [
                "00",
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
                "13",
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23"
            ]
        temp_dict['days'] = days_list
        temp_dict['data'] = temp_list
        return temp_dict

    def fake_data_days(days):
        temp_dict = {}
        dt = []
        days_list = days
        temp_list = []

        for day in days_list:
            for idx, v in enumerate(days_list):
                for i in range(random.randint(24, 24)):
                    temp_list.append([i, idx, random.randint(50, 1000)])

        temp_dict['hours'] = [
                "00",
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
                "13",
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23"
            ]
        temp_dict['days'] = days_list
        temp_dict['data'] = temp_list
        return temp_dict

    if 'f5_request_hour_count' in data["key"]:

       
        if 'days' in data and len(data['days']) > 0:
            days = data['days']
            return {
                data["key"]: fake_data_days(days)
            }

        
        if 'from' in data and 'to' in data:
            dt_from = data['from']
            dt_to = data['to']
            return {
                data["key"]: fake_data_dt(dt_from, dt_to)
            }

        else:
            now = datetime.now()
            dt_from = now - timedelta(days=now.weekday())
            return {
                    data["key"]: fake_data_dt(dt_from.strftime('%Y-%m-%d %H:%M:%S'), now.strftime('%Y-%m-%d %H:%M:%S'))
                }
