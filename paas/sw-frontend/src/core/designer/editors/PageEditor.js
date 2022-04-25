/**
 * Created by caoshuaibiao on 2020/11/30.
 * 节点页面编辑器
 */
import React from 'react';
import { BuildOutlined, CodeOutlined, DatabaseOutlined, SettingOutlined, SnippetsOutlined } from '@ant-design/icons';
import {
    Layout,
    Menu,
    Dropdown,
    Tree,
    Steps,
    Button,
    Card,
    Radio,
    List,
    Tabs,
    Drawer,
    Modal,
    Tooltip,
    Image,
    Spin,
    Collapse,
    Space
} from "antd";
import PageModel from '../../framework/model/PageModel';
import Constants from '../../framework/model/Constants';
import DataSourceEditor from "./DataSourceEditor";
import PageContent from "../../framework/core/PageContent";
import * as util from '../../../utils/utils';
import _ from 'lodash';
import html2canvas from "html2canvas";

import '../workbench/index.less';
import './index.less';
import ContentLayout from "../../framework/components/ContentLayout";
import AceViewer from '../../../components/FormBuilder/FormItem/AceViewer';
import FluidContentLayoutDesigner from "../../framework/components/FluidContentLayoutDesigner";
import appMenuTreeService from '../../services/appMenuTreeService';
import { page_template_meta, template_app_id } from './TemplateConstant';

const { Step } = Steps;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const steps = [
    {
        title: '选择类型',
        content: 'First-content',
    },
    {
        title: '选择布局',
        content: 'Second-content',
    },
    {
        title: '创建页面',
        content: 'Last-content',
    },
];

export default class PageEditor extends React.Component {

    constructor(props) {
        super(props);
        let pageModel = props.pageModel || PageModel.CREATE_DEFAULT_INSTANCE();
        this.state = {
            pageModel: pageModel,
            showPreview: false,
            openDrawer: false,
            current: 0,
            activeKey: "dev",
            showTemplateList: false,
            confirmLoading: false,
            templateList: [],
            activeTarget: '',
            operFlag: 'save',
            getTemplateLoading: false,
            saveOrCreat: false.FluidContentLayoutDesigner,
            categoryList: [],//模板类别
            activePanel: '',
        };
    }

    componentDidMount() {
        let { pageModel } = this.state;
        let containerModel = pageModel.getRootWidgetModel();
        let bleanWedgets = containerModel.widgets; //动态展示保存模板/从模板创建
        if (bleanWedgets && bleanWedgets.length && bleanWedgets[0].rows.length) {
            this.setState({ saveOrCreat: true });
        } else {
            this.setState({ saveOrCreat: false });
        }
    }
    next() {
        const { mode } = this.state;
        const current = this.state.current + 1;
        if (mode === PageModel.TYPE_GRAFANA) {
            this.createByWizard().then(result => {

            });
        } else {
            this.setState({ current });
        }
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    createByWizard = () => {
        let { pageModel, mode } = this.state;
        pageModel.createFromWizard({ mode: mode }).then(result => {

        });
    };

    changeButtonStatus = (flag) => {
        this.setState({
            saveOrCreat: flag
        })
    }
    renderWizard = () => {
        let { current, pageModel, mode } = this.state;
        return (
            <Card style={{ marginLeft: -1, marginTop: -2, height: '100%' }}>
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div style={{ marginTop: 24, marginBottom: 24 }}>
                    {
                        current === 0 &&
                        <div>
                            <span>页面类型&nbsp;:&emsp;</span>
                            <Radio.Group onChange={(e) => this.setState({ mode: e.target.value })} value={mode}>
                                <Radio value={Constants.PAGE_TYPE_ABM_PAGE}>ABM Page</Radio>
                                <Radio value={Constants.PAGE_TYPE_GRAFANA}>Grafana Dashboard</Radio>
                            </Radio.Group>
                        </div>
                    }
                    {
                        current === 1 &&
                        <div>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={pageModel.getLayoutTemplate()}
                                renderItem={item => (
                                    <List.Item>
                                        <Card hoverable title={<span><Radio value={item.title} />{item.title}</span>} size="small">布局缩略图</Card>
                                    </List.Item>
                                )}
                            />
                        </div>
                    }
                    {
                        current === 2 &&
                        <div>
                            收集前面信息进行确认预览展示
                        </div>
                    }
                </div>
                <div>
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => this.next()}>
                            下一步
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={this.createByWizard}>
                            创建
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            上一步
                        </Button>
                    )}
                </div>
            </Card>
        )
    };

    handleChange = res => {
        console.log(res);
    };



    handleSave = () => {
        let { pageModel } = this.state, { onSave } = this.props;
        onSave && onSave(pageModel)
    };

    handlePreview = () => {
        this.setState({
            showPreview: true,
            openDrawer: true,
            showJson: false
        });
    };

    onClose = () => {
        this.setState({
            openDrawer: false
        });
    };

    handleToolClick = (toolType, payload) => {
        let { pageModel } = this.state;
        pageModel.getRootWidgetModel().events.emit(toolType, payload);
    };

    handleChangeTab = res => {
        this.setState({ activeKey: res })
    }
    handleSaveAs = () => {
        let { nodeData, saveAs } = this.props;
        let newParam = _.cloneDeep(page_template_meta);
        let templateServiceType = util.generateId();
        newParam.serviceType = templateServiceType;
        newParam.config.name = nodeData.config.name;
        newParam.config.label = nodeData.config.label;
        this.setState({
            confirmLoading: true
        })
        try {
            html2canvas(document.querySelector("#capture")).then(canvas => {
                newParam.config.capture = canvas.toDataURL("image/png");
                appMenuTreeService.insertNode(newParam).then(res => {
                    this.setState({
                        showTemplateList: false,
                        confirmLoading: false
                    })
                    saveAs && saveAs(templateServiceType)
                });
            });
        } catch (error) {
            appMenuTreeService.insertNode(newParam).then(res => {
                this.setState({
                    showTemplateList: false,
                    confirmLoading: false
                })
                saveAs && saveAs(templateServiceType)
            });
        }
    }
    // 从模板创建
    handleCreateFromTemplate = () => {
        this.setState({ confirmLoading: true })
        let { templateList, activeTarget } = this.state;
        let groupData = templateList.find(item => item.serviceType === activeTarget);
        let nodeTypeId = groupData && groupData.nodeTypePath;
        let { createFromTemplate } = this.props;
        createFromTemplate && createFromTemplate(nodeTypeId, groupData);
        this.setState({
            showTemplateList: false,
            confirmLoading: false
        })
    }
    handleCancel = () => {
        this.setState({
            showTemplateList: false,

        })
    }
    getTemplateList = () => {
        this.setState({
            getTemplateLoading: true
        })
        appMenuTreeService.getMenuTree(template_app_id).then(res => {
            console.log(res, 'res-menuTree');
            // let sunMenuTree = res.children.find(item => item.name === 'home') || {};
            let categoryList = [];
            res && res.children.forEach(item => {
                let { label, serviceType } = item;
                categoryList.push({ label, serviceType });
            })
            let sunMenuTree = res.children;
            this.setState({
                templateList: sunMenuTree || [],
                getTemplateLoading: false,
                categoryList: categoryList
            })
        }).finally(() => {
            this.setState({
                getTemplateLoading: false
            })
        })
    }
    showTemlateListModal = (operFlag) => {
        this.getTemplateList()
        this.setState({
            showTemplateList: true,
            operFlag: operFlag,
            activeTarget: '',
        })
    }
    setActive = (item) => {
        let { activeTarget } = this.state;
        this.setState({
            activeTarget: item.serviceType === activeTarget ? '' : item.serviceType
        })
    }
    handleCategoryClicked = (keys) => {
        this.setState({
            activePanel: keys,
        });
    };
    render() {
        let { pageModel, showPreview, openDrawer, showJson, activeKey, showTemplateList, confirmLoading, templateList, activeTarget, operFlag, getTemplateLoading, saveOrCreat, activePanel } = this.state, { height = 620, nodeData, contentLoading } = this.props;
        let tabEditorContentStyle = { height: height - 42, overflowY: "auto", overflowX: "none" }, { config } = nodeData;
        let { pageLayoutType = Constants.PAGE_LAYOUT_TYPE_CUSTOM } = config, containerModel = pageModel.getRootWidgetModel();
        return (
            <div className={"globalBackground page_small_tabs abm-frontend-designer-page-editor"}>
                <Tabs activeKey={activeKey} onChange={this.handleChangeTab} size="small" tabBarExtraContent={
                    <div className="feature-bar">
                        {activeKey === "dev" && pageLayoutType === Constants.PAGE_LAYOUT_TYPE_CUSTOM &&
                            <Button size="small" className="feature-button" onClick={() => this.handleToolClick(Constants.TOOL_TYPE_ADD)} >
                                <div className="wrapper">
                                    <svg t="1619012520900" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36244" width="16" height="16">
                                        <path className="path" d="M138.24 158.72v706.56c0 11.264 9.216 20.48 20.48 20.48h299.52v-0.512c10.24-1.024 17.92-9.728 17.92-19.968s-7.68-18.944-17.92-19.968v-0.512H199.68c-11.264 0-20.48-9.216-20.48-20.48V199.68c0-11.264 9.216-20.48 20.48-20.48h624.64c11.264 0 20.48 9.216 20.48 20.48v258.56h0.512c1.024 10.24 9.728 17.92 19.968 17.92s18.944-7.68 19.968-17.92h0.512V158.72c0-11.264-9.216-20.48-20.48-20.48H158.72c-11.264 0-20.48 9.216-20.48 20.48z" p-id="36245"></path>
                                        <path className="path" d="M701.44 307.2H322.56c-11.264 0-20.48-9.216-20.48-20.48s9.216-20.48 20.48-20.48h378.88c11.264 0 20.48 9.216 20.48 20.48s-9.216 20.48-20.48 20.48zM865.792 706.048H506.368c-10.752 0-19.968-8.704-19.968-19.968 0-10.752 8.704-19.968 19.968-19.968h359.936c10.752 0 19.968 8.704 19.968 19.968-0.512 10.752-9.216 19.968-20.48 19.968z" p-id="36246"></path>
                                        <path className="path" d="M666.112 865.792V506.368c0-10.752 8.704-19.968 19.968-19.968 10.752 0 19.968 8.704 19.968 19.968v359.936c0 10.752-8.704 19.968-19.968 19.968-10.752-0.512-19.968-9.216-19.968-20.48z" p-id="36247">
                                        </path>
                                    </svg>
                                    <span className="text">添加</span>
                                </div>
                            </Button>}
                        {
                            saveOrCreat && <Button size="small" icon={<SnippetsOutlined />} style={{ position: 'relative', top: -3 }} type="primary" onClick={() => this.showTemlateListModal('save')}>
                                另存为模板
                            </Button>
                        }
                        <Button size="small" className="feature-button" onClick={this.handlePreview}>
                            <div className="wrapper">
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31824" width="16" height="16">
                                    <path className="path" d="M886.26 138.29H169.54A60.62 60.62 0 0 0 109 198.84V669.6a60.62 60.62 0 0 0 60.55 60.55h333.62V837.6H136.28v27.29h783.24V837.6H557.75V730.15h328.51a60.62 60.62 0 0 0 60.55-60.55V198.84a60.62 60.62 0 0 0-60.55-60.55z m6 531.31a5.91 5.91 0 0 1-6 6H169.54a5.91 5.91 0 0 1-6-6V198.84a5.91 5.91 0 0 1 6-6h716.72a5.91 5.91 0 0 1 6 6z" p-id="31825"></path>
                                    <path className="path" d="M659.75 416.26L481.62 313.38a21 21 0 0 0-20.92 0.1 20.68 20.68 0 0 0-10.41 18.06v205.53a20.68 20.68 0 0 0 10.41 18.06 21 21 0 0 0 21 0.06l178-102.84a20.85 20.85 0 0 0 0-36.1zM477.58 526V342.56l158.84 91.74z" p-id="31826" >
                                    </path>
                                </svg>
                                <span className="text"> 预览</span>
                            </div>
                        </Button>
                        <Button size="small" type="primary" loading={contentLoading} className="feature-button" onClick={this.handleSave}>
                            <div className="wrapper">
                                <svg t="1619012672491" className="save-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="37884" width="16" height="16">
                                    <path d="M954.083556 267.434667L702.549333 63.331556A28.444444 28.444444 0 0 0 684.515556 56.888889h-483.555556C87.921778 56.888889 56.888889 91.648 56.888889 199.964444v615.096889C56.888889 925.895111 92.103111 967.111111 200.96 967.111111h625.777778C941.624889 967.111111 967.111111 918.087111 967.111111 815.061333V289.436444c0-8.519111-6.456889-16.597333-13.027555-22.001777zM725.333333 154.652444v196.053334C725.333333 384 720.071111 384 695.921778 384H331.818667C298.183111 384 298.666667 376.903111 298.666667 350.705778V113.777778h375.68L725.333333 154.652444z m184.888889 660.408889C910.222222 902.229333 898.375111 910.222222 826.737778 910.222222h-625.777778C123.192889 910.222222 113.777778 895.118222 113.777778 815.089778V199.964444C113.777778 124.245333 119.751111 113.777778 200.96 113.777778H270.222222v236.928C270.222222 404.977778 297.102222 412.444444 331.818667 412.444444h364.103111C746.069333 412.444444 753.777778 390.144 753.777778 350.705778V177.464889l156.444444 125.425778v512.170666z" p-id="37885"></path><path d="M611.555556 298.666667a28.444444 28.444444 0 0 0 28.444444-28.444445v-85.333333a28.444444 28.444444 0 0 0-56.888889 0v85.333333a28.444444 28.444444 0 0 0 28.444445 28.444445zM293.404444 611.555556h113.777778a14.222222 14.222222 0 1 0 0-28.444445h-113.777778a14.222222 14.222222 0 1 0 0 28.444445zM464.071111 611.555556h142.222222c7.879111 0 14.222222-6.357333 14.222223-14.222223s-6.343111-14.222222-14.222223-14.222222h-142.222222a14.222222 14.222222 0 1 0 0 28.444445zM720.071111 583.111111h-56.888889a14.222222 14.222222 0 1 0 0 28.444445h56.888889c7.879111 0 14.222222-6.357333 14.222222-14.222223s-6.343111-14.222222-14.222222-14.222222zM293.404444 682.666667h56.888889a14.222222 14.222222 0 1 0 0-28.444445h-56.888889a14.222222 14.222222 0 1 0 0 28.444445zM407.182222 654.222222a14.222222 14.222222 0 1 0 0 28.444445h113.777778c7.879111 0 14.222222-6.357333 14.222222-14.222223s-6.343111-14.222222-14.222222-14.222222h-113.777778zM720.071111 654.222222h-142.222222a14.222222 14.222222 0 1 0 0 28.444445h142.222222c7.879111 0 14.222222-6.357333 14.222222-14.222223s-6.343111-14.222222-14.222222-14.222222zM435.626667 739.555556h-142.222223a14.222222 14.222222 0 1 0 0 28.444444h142.222223a14.222222 14.222222 0 1 0 0-28.444444zM535.182222 739.555556h-42.666666a14.222222 14.222222 0 1 0 0 28.444444h42.666666c7.879111 0 14.222222-6.357333 14.222222-14.222222s-6.343111-14.222222-14.222222-14.222222z" p-id="37886"></path>
                                </svg>
                                <span className="text">保存</span>
                            </div>
                        </Button>
                    </div>
                }>
                    <TabPane tab={<span><BuildOutlined style={{ marginRight: 8 }} />画布</span>} key="dev">
                        <div style={tabEditorContentStyle}>
                            {
                                pageLayoutType === Constants.PAGE_LAYOUT_TYPE_FLUID &&
                                <FluidContentLayoutDesigner changeButtonStatus={this.changeButtonStatus} {...this.props} containerModel={containerModel} />
                            }
                            {
                                pageLayoutType === Constants.PAGE_LAYOUT_TYPE_CUSTOM &&
                                <ContentLayout {...this.props} height={height - 42} containerModel={containerModel} />
                            }
                        </div>
                    </TabPane>
                    <TabPane tab={<span><SettingOutlined style={{ marginRight: 8 }} />设置</span>} key="setting">
                        <Tabs tabPosition={"left"} animated tabBarGutter={2}>
                            <TabPane tab={<span><CodeOutlined style={{ marginRight: 8 }} />源码</span>} key="dev">
                                <AceViewer model={{
                                    showDiff: false,
                                    defModel: { height: height - 48, disableShowDiff: true, mode: "json" },
                                }} mode="json" value={pageModel.toJSON()} readOnly={true} />
                            </TabPane>
                        </Tabs>
                    </TabPane>
                    <TabPane tab={<span><DatabaseOutlined style={{ marginRight: 8 }} />页面数据源</span>} key="datasource">
                        <DataSourceEditor
                            value={pageModel.config.dataSourceMeta || {}}
                            onValuesChange={(changedValues, allValues) => {
                                pageModel.setDataSourceMeta(allValues);
                            }
                            }
                        />
                    </TabPane>
                </Tabs>
                <Drawer
                    title={showJson ? "页面源码" : "页面预览"}
                    bodyStyle={showJson ? undefined : { padding: "0px" }}
                    placement="right"
                    destroyOnClose={true}
                    width={showJson ? '50vw' : '85vw'}
                    closable={true}
                    onClose={this.onClose}
                    visible={openDrawer}
                >
                    <div>
                        <PageContent pageModel={pageModel} pageLayoutType={pageLayoutType} />
                    </div>
                </Drawer>
                <Drawer
                    title={`模板列表`}
                    placement="right"
                    width={'90vw'}
                    onClose={this.handleCancel}
                    visible={showTemplateList}
                    extra={
                        <Space>
                            <Button onClick={this.handleCancel}>取消</Button>
                            {
                                operFlag === 'save' ? <Button loading={confirmLoading} onClick={this.handleSaveAs} type="primary">{activeTarget ? '覆盖当前选中模板' : '新增模板'}</Button> : <Button loading={confirmLoading} onClick={this.handleCreateFromTemplate} type="primary">确定</Button>
                            }
                        </Space>
                    }
                >
                    <section className='template-parent-pane'>
                        <Collapse activeKey={activePanel} bordered={false} onChange={this.handleCategoryClicked}>
                            {
                                templateList.map(templateCate => {
                                    return <Panel header={templateCate.label} style={{ minWidth: 500 }} key={templateCate.serviceType}>
                                        <div className='template-pane'>
                                            {
                                                templateCate.children.map((item) => {
                                                    return <div onClick={() => this.setActive(item)} class={item.serviceType === activeTarget ? 'template-item-active' : 'template-item'}>
                                                        <div className="template-logo" style={{ backgroundImage: `url(${item.capture})`, backgroundPosition: 'center center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', }}>
                                                            <Image onClick={(e) => e.stopPropagation()} height={20} width={20} src={item.capture} />
                                                        </div>
                                                        <div className="template-label">
                                                            <Tooltip placement="top" title={item.label}>
                                                                {item.label}
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </Panel>
                                })
                            }
                        </Collapse>
                    </section>
                </Drawer>
                <Modal
                    
                >

                </Modal>
            </div>
        );
    }
}
