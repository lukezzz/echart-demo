
import socket
from flask_restful import reqparse, abort
from app.models.device import Department, LoginType, Product, Category, Model, Location, Device, ConfigType, Schedule

def verify_ip(ip):
    """ 
    Verify the IP address is valid
    """
    try:
        socket.inet_aton(ip)
        return ip
    except:
        raise ValueError("The ip address name was invalid.")


def abort_if_item_doesnt_exit(item_id, Item):
    item = Item.query.filter_by(id=item_id).first()
    if not item:
        abort(404, message="item {} doesn't exist".format(item_id))
    return item

def abort_if_task_doesnt_exit(task_id, Item):
    item = Item.query.filter_by(task_id=task_id).first()
    if not item:
        abort(404, message="item {} doesn't exist".format(task_id))
    return item

def non_empty_str(s):
    """
    check stirng is empty or blank, or item name already existed!
    """
    if s is None or str(s).strip() == '':
        raise ValueError("The item name was empty or invalid.")   
    return str(s).strip()


def abort_if_item_exit_or_str_invalid(s, query_class):
    """
    check stirng is empty or blank, or item name already existed!
    """
    if s is None or str(s).strip() == '':
        raise ValueError("The item name was empty or invalid.")
    item = query_class.query.filter_by(name=s).first()
    if item:
        raise ValueError("Duplicated name.")
    return s

def abort_if_item_name_invalid(item_name, query_class):
    """
    check item id must be invalid!
    """
    item = query_class.query.filter_by(name=item_name).first()
    if not item:
        raise ValueError("Item not existed.")
    return item.name

def abort_if_item_id_invalid(item_id, query_class):
    """
    check item id must be invalid!
    """
    item = query_class.query.filter_by(id=item_id).first()
    if not item:
        raise ValueError("Item not existed.")
    return item

def check_item_name():
    """
    parse item prop in request, name must be valid string
    """
    parser = reqparse.RequestParser()
    parser.add_argument('name', required=True, type=non_empty_str, help="The item name was empty or invalid.")

    return parser.parse_args()

def search_device_filters(filters):
    """
    parse device prop in request, device obj must be exist
    """
    
    map_name_to_model = {
        'product': Product,
        'department': Department,
        'logintype': LoginType,
        'model': Model,
        'category': Category,
        'location': Location,
        'schedule': Schedule,
        'configtype': ConfigType
    }

    query_filters = []
    for k, values in filters.items():
        if k == 'hostname':
            query_filters.append(Device.hostname.like('%{}%'.format(values[0])))
        elif k == 'ip':
            query_filters.append(Device.ip.like('%{}%'.format(values[0])))
        else:
            if k in map_name_to_model:
                id_list = []
                items = map_name_to_model[k].query.filter(map_name_to_model[k].name.in_(values)).all()
                for item in items:
                    id_list.append(item.id)
                print(id_list)
                query_filters.append(getattr(Device, "{}_id".format(k)).in_(id_list))
            else:
                continue


    return query_filters

