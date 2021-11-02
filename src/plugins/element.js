import Vue from 'vue'
import {
    Form,
    FormItem,
    Input,
    Button,
    Container,
    Header,
    Aside,
    Footer,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    ButtonGroup,
    InputNumber,
    Col,
    Table,
    TableColumn,
    Tooltip,
    Switch,
    Pagination,
    Dialog,
    MessageBox,
    Message} from "element-ui"

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(ButtonGroup)
Vue.use(InputNumber)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;