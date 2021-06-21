import pymysql


class UserInfoTable(object):
    """
    This is a useful class to manage user info.
    It could taka some actions when adding user info or querying user info.
    In a word, It is very useful
    """
    def __init__(self):
        self.sql_connect = pymysql.connect(host="127.0.0.1", user="root", password="2021",
                                           database="my_graduation_project", charset="utf8")
        self.sql_cursor = self.sql_connect.cursor()
        self.sql_statement = "select * from user_info"
        self.flag = False 

    def add_user(self, username, password):
        # We should check user if exists before adding user info.
        self.sql_statement = f'insert into user_info values ("{username}","{password}")'
        self.query_user_exist(username)
        if not self.flag:
            self.sql_cursor.execute(self.sql_statement)
            self.sql_connect.commit()
            print("用户添加成功了")
            return True
        else:
            print("用户添加失败了")
            return False

    def query_user_exist(self, username):
        # Query user if exists and take some info for you.
        if self.sql_cursor.execute(f'select * from user_info where username="{username}"'):
            self.sql_connect.commit()
            self.flag = True  # 用户存在
            print("该用户名存在，请尝试另一个用户名")
        else:
            self.flag = False
            print("该用户名不存在，你可以使用它来创建用户名")

    def verify_user(self, username, password):
        # To verify user's info is correct or not.
        self.sql_statement = f'select * from user_info where (username="{username}" and password="{password}")'
        if self.sql_cursor.execute(self.sql_statement):
            self.sql_connect.commit()
            print("用户名和密码都正确，可以登陆了")
            return True
        else:
            print("请检查你的用户名和密码")
            return False

    def show_all_user(self):
        # Show all user info.
        self.sql_cursor.execute("select * from user_info")
        return self.sql_cursor.fetchall()