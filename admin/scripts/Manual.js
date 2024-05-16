/**
 * 이 파일은 아이모듈 매뉴얼모듈의 일부입니다. (https://www.imodules.io)
 *
 * 관리자 UI 이벤트를 관리하는 클래스를 정의한다.
 *
 * @file /modules/manual/admin/scripts/Manual.ts
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 5. 11.
 */
var modules;
(function (modules) {
    let manual;
    (function (manual) {
        let admin;
        (function (admin) {
            class Manual extends modules.admin.admin.Component {
                manuals = {
                    /**
                     * 매뉴얼을 추가한다.
                     *
                     * @param {string} manual_id - 매뉴얼고유값
                     */
                    add: (manual_id = null) => {
                        new Aui.Window({
                            title: manual_id === null
                                ? this.printText('admin.manuals.add')
                                : this.printText('admin.manuals.edit'),
                            width: 500,
                            modal: true,
                            resizable: false,
                            items: [
                                new Aui.Form.Panel({
                                    border: false,
                                    layout: 'fit',
                                    items: [
                                        new Aui.Form.Field.Text({
                                            name: 'manual_id',
                                            label: this.printText('admin.manuals.manual_id'),
                                            allowBlank: false,
                                        }),
                                        new Aui.Form.Field.Text({
                                            name: 'title',
                                            label: this.printText('admin.manuals.title'),
                                            allowBlank: false,
                                        }),
                                        new AdminUi.Form.Field.Template({
                                            name: 'template',
                                            label: this.printText('template'),
                                            componentType: 'module',
                                            componentName: 'manual',
                                            allowBlank: false,
                                        }),
                                        new AdminUi.Form.Field.Permission({
                                            name: 'permission',
                                            label: this.printText('admin.permission'),
                                            value: 'true',
                                        }),
                                    ],
                                }),
                            ],
                            buttons: [
                                new Aui.Button({
                                    text: Aui.printText('buttons.cancel'),
                                    handler: (button) => {
                                        const window = button.getParent();
                                        window.close();
                                    },
                                }),
                                new Aui.Button({
                                    text: Aui.printText('buttons.ok'),
                                    buttonClass: 'confirm',
                                    handler: async (button) => {
                                        const window = button.getParent();
                                        const form = button.getParent().getItemAt(0);
                                        const results = await form.submit({
                                            url: this.getProcessUrl('manual'),
                                            params: { manual_id: manual_id },
                                        });
                                        if (results.success == true) {
                                            Aui.Message.show({
                                                title: (await Admin.getText('info')),
                                                message: Aui.printText('actions.saved'),
                                                icon: Aui.Message.INFO,
                                                buttons: Aui.Message.OK,
                                                handler: async () => {
                                                    const manuals = Aui.getComponent('manuals');
                                                    await manuals.getStore().reload();
                                                    manuals.select({ manual_id: results.manual_id });
                                                    Aui.Message.close();
                                                    window.close();
                                                },
                                            });
                                        }
                                    },
                                }),
                            ],
                            listeners: {
                                show: async (window) => {
                                    if (manual_id !== null) {
                                        const form = window.getItemAt(0);
                                        const results = await form.load({
                                            url: this.getProcessUrl('manual'),
                                            params: { manual_id: manual_id },
                                        });
                                        if (results.success == false) {
                                            window.close();
                                        }
                                    }
                                },
                            },
                        }).show();
                    },
                    /**
                     * 선택한 매뉴얼을 삭제한다.
                     *
                     * @param {string} manual_id - 매뉴얼고유값
                     */
                    delete: (manual_id) => {
                        Aui.Message.delete({
                            url: this.getProcessUrl('manuals'),
                            params: { manual_id: manual_id },
                            message: this.printText('admin.manuals.delete_confirm'),
                            handler: async (results) => {
                                if (results.success == true) {
                                    const manuals = Aui.getComponent('manuals');
                                    manuals.getStore().reload();
                                }
                            },
                        });
                    },
                };
                categories = {
                    /**
                     * 분류를 추가한다.
                     *
                     * @param {string} category_id - 카테고리고유값
                     */
                    add: (category_id = null) => {
                        const categories = Aui.getComponent('categories');
                        const manual_id = categories.getStore().getParam('manual_id');
                        new Aui.Window({
                            title: category_id === null
                                ? this.printText('admin.categories.add')
                                : this.printText('admin.categories.edit'),
                            width: 500,
                            modal: true,
                            resizable: false,
                            items: [
                                new Aui.Form.Panel({
                                    border: false,
                                    layout: 'fit',
                                    items: [
                                        new Aui.Form.Field.Text({
                                            name: 'category_id',
                                            label: this.printText('admin.categories.category_id'),
                                            allowBlank: false,
                                        }),
                                        new Aui.Form.Field.Text({
                                            name: 'title',
                                            label: this.printText('admin.categories.title'),
                                            allowBlank: false,
                                        }),
                                        new AdminUi.Form.Field.Permission({
                                            name: 'permission',
                                            label: this.printText('admin.permission'),
                                            value: 'true',
                                        }),
                                        new Aui.Form.Field.Check({
                                            name: 'has_version',
                                            label: this.printText('admin.categories.has_version'),
                                            boxLabel: this.printText('admin.categories.has_version_help'),
                                        }),
                                    ],
                                }),
                            ],
                            buttons: [
                                new Aui.Button({
                                    text: Aui.printText('buttons.cancel'),
                                    handler: (button) => {
                                        const window = button.getParent();
                                        window.close();
                                    },
                                }),
                                new Aui.Button({
                                    text: Aui.printText('buttons.ok'),
                                    buttonClass: 'confirm',
                                    handler: async (button) => {
                                        const window = button.getParent();
                                        const form = button.getParent().getItemAt(0);
                                        const results = await form.submit({
                                            url: this.getProcessUrl('category'),
                                            params: { manual_id: manual_id, category_id: category_id },
                                        });
                                        if (results.success == true) {
                                            Aui.Message.show({
                                                title: (await Admin.getText('info')),
                                                message: Aui.printText('actions.saved'),
                                                icon: Aui.Message.INFO,
                                                buttons: Aui.Message.OK,
                                                handler: async () => {
                                                    const categories = Aui.getComponent('categories');
                                                    await categories.getStore().reload();
                                                    categories.select({ category_id: results.manual_id });
                                                    Aui.Message.close();
                                                    window.close();
                                                },
                                            });
                                        }
                                    },
                                }),
                            ],
                            listeners: {
                                show: async (window) => {
                                    if (category_id !== null) {
                                        const form = window.getItemAt(0);
                                        const results = await form.load({
                                            url: this.getProcessUrl('category'),
                                            params: { category_id: category_id, manual_id: manual_id },
                                        });
                                        if (results.success == false) {
                                            window.close();
                                        }
                                    }
                                },
                            },
                        }).show();
                    },
                    /**
                     * 선택한 분류를 삭제한다.
                     *
                     * @param {string} category_id - 분류고유값
                     */
                    delete: (category_id) => {
                        const categories = Aui.getComponent('categories');
                        const manual_id = categories.getStore().getParam('manual_id');
                        Aui.Message.delete({
                            url: this.getProcessUrl('categories'),
                            params: { category_id: category_id, manual_id: manual_id },
                            message: this.printText('admin.categories.delete_confirm'),
                            handler: async (results) => {
                                if (results.success == true) {
                                    const manuals = Aui.getComponent('categories');
                                    manuals.getStore().reload();
                                }
                            },
                        });
                    },
                };
                contents = {
                    /**
                     * 분류를 추가한다.
                     *
                     * @param {string} content_id - 분류고유값
                     */
                    add: (content_id = null) => {
                        const contents = Aui.getComponent('contents');
                        const manual_id = contents.getStore().getParam('manual_id');
                        const category_id = contents.getStore().getParam('category_id');
                        new Aui.Window({
                            title: content_id === null
                                ? this.printText('admin.contents.add')
                                : this.printText('admin.contents.edit'),
                            width: 500,
                            modal: true,
                            resizable: false,
                            items: [
                                new Aui.Form.Panel({
                                    border: false,
                                    layout: 'fit',
                                    items: [
                                        new Aui.Form.Field.Text({
                                            name: 'title',
                                            label: this.printText('admin.contents.title'),
                                            allowBlank: false,
                                        }),
                                        new Aui.Form.Field.Select({
                                            name: 'parent_id',
                                            label: this.printText('admin.contents.parent_id'),
                                            store: new Aui.TreeStore.Remote({
                                                url: this.getProcessUrl('contents'),
                                                params: {
                                                    manual_id: manual_id,
                                                    category_id: category_id,
                                                    is_root: 'TRUE',
                                                },
                                            }),
                                            displayField: 'title',
                                            valueField: 'content_id',
                                            value: '@',
                                        }),
                                        new AdminUi.Form.Field.Permission({
                                            name: 'permission',
                                            label: this.printText('admin.permission'),
                                            value: 'true',
                                        }),
                                    ],
                                }),
                            ],
                            buttons: [
                                new Aui.Button({
                                    text: Aui.printText('buttons.cancel'),
                                    handler: (button) => {
                                        const window = button.getParent();
                                        window.close();
                                    },
                                }),
                                new Aui.Button({
                                    text: Aui.printText('buttons.ok'),
                                    buttonClass: 'confirm',
                                    handler: async (button) => {
                                        const window = button.getParent();
                                        const form = button.getParent().getItemAt(0);
                                        const results = await form.submit({
                                            url: this.getProcessUrl('content'),
                                            params: {
                                                manual_id: manual_id,
                                                category_id: category_id,
                                                content_id: content_id,
                                            },
                                        });
                                        if (results.success == true) {
                                            Aui.Message.show({
                                                title: (await Admin.getText('info')),
                                                message: Aui.printText('actions.saved'),
                                                icon: Aui.Message.INFO,
                                                buttons: Aui.Message.OK,
                                                handler: async () => {
                                                    const contents = Aui.getComponent('contents');
                                                    await contents.getStore().reload();
                                                    contents.select({ content_id: results.content_id });
                                                    Aui.Message.close();
                                                    window.close();
                                                },
                                            });
                                        }
                                    },
                                }),
                            ],
                            listeners: {
                                show: async (window) => {
                                    if (content_id !== null) {
                                        const form = window.getItemAt(0);
                                        const results = await form.load({
                                            url: this.getProcessUrl('content'),
                                            params: { content_id: content_id },
                                        });
                                        if (results.success == false) {
                                            window.close();
                                        }
                                    }
                                },
                            },
                        }).show();
                    },
                    /**
                     * 선택한 목차를 삭제한다.
                     *
                     * @param {string} content_id - 목차고유값
                     */
                    delete: (content_id) => {
                        Aui.Message.delete({
                            url: this.getProcessUrl('contents'),
                            params: { content_id: content_id },
                            message: this.printText('admin.contents.delete_confirm'),
                            handler: async (results) => {
                                if (results.success == true) {
                                    const contents = Aui.getComponent('contents');
                                    contents.getStore().reload();
                                }
                            },
                        });
                    },
                };
                documents = {
                    /**
                     * 문서를 추가한다.
                     *
                     * @param {string} start_version - 문서버전
                     */
                    add: (start_version = null) => {
                        const documents = Aui.getComponent('documents');
                        const manual_id = documents.getStore().getParam('manual_id');
                        const category_id = documents.getStore().getParam('category_id');
                        const content_id = documents.getStore().getParam('content_id');
                        new Aui.Window({
                            title: start_version === null
                                ? this.printText('admin.documents.add')
                                : this.printText('admin.documents.edit'),
                            width: 700,
                            modal: true,
                            resizable: false,
                            items: [
                                new Aui.Form.Panel({
                                    border: false,
                                    scrollable: false,
                                    items: [
                                        new Aui.Form.FieldSet({
                                            title: this.printText('admin.versions.versions'),
                                            items: [
                                                new Aui.Form.Field.Container({
                                                    combineValidate: true,
                                                    items: [
                                                        new Aui.Form.Field.Text({
                                                            name: 'start_version',
                                                            width: 100,
                                                        }),
                                                        new Aui.Form.Field.Display({
                                                            value: this.printText('admin.versions.range_start'),
                                                        }),
                                                        new Aui.Form.Field.Text({
                                                            name: 'end_version',
                                                            width: 100,
                                                        }),
                                                        new Aui.Form.Field.Display({
                                                            value: this.printText('admin.versions.range_end'),
                                                            flex: 1,
                                                        }),
                                                        new Aui.Form.Field.Check({
                                                            name: 'all_version',
                                                            boxLabel: this.printText('admin.versions.all_version'),
                                                            listeners: {
                                                                change: (field, value) => {
                                                                    const form = field.getForm();
                                                                    form.getField('start_version').setDisabled(value);
                                                                    form.getField('end_version').setDisabled(value);
                                                                },
                                                            },
                                                        }),
                                                    ],
                                                    helpText: this.printText('admin.versions.range_help'),
                                                }),
                                            ],
                                        }),
                                        new Aui.Form.Field.Editor({
                                            name: 'content',
                                        }),
                                    ],
                                }),
                            ],
                            buttons: [
                                new Aui.Button({
                                    text: Aui.printText('buttons.cancel'),
                                    handler: (button) => {
                                        const window = button.getParent();
                                        window.close();
                                    },
                                }),
                                new Aui.Button({
                                    text: Aui.printText('buttons.ok'),
                                    buttonClass: 'confirm',
                                    handler: async (button) => {
                                        const window = button.getParent();
                                        const form = button.getParent().getItemAt(0);
                                        const results = await form.submit({
                                            url: this.getProcessUrl('document'),
                                            params: {
                                                manual_id: manual_id,
                                                category_id: category_id,
                                                content_id: content_id,
                                                start_version: start_version,
                                            },
                                        });
                                        if (results.success == true) {
                                            Aui.Message.show({
                                                title: (await Admin.getText('info')),
                                                message: Aui.printText('actions.saved'),
                                                icon: Aui.Message.INFO,
                                                buttons: Aui.Message.OK,
                                                handler: async () => {
                                                    const documents = Aui.getComponent('documents');
                                                    await documents.getStore().reload();
                                                    documents.select({ content_id: results.content_id });
                                                    Aui.Message.close();
                                                    window.close();
                                                },
                                            });
                                        }
                                    },
                                }),
                            ],
                            listeners: {
                                show: async (window) => {
                                    if (start_version !== null) {
                                        const form = window.getItemAt(0);
                                        const results = await form.load({
                                            url: this.getProcessUrl('document'),
                                            params: {
                                                manual_id: manual_id,
                                                category_id: category_id,
                                                content_id: content_id,
                                                start_version: start_version,
                                            },
                                        });
                                        if (results.success == false) {
                                            window.close();
                                        }
                                    }
                                },
                            },
                        }).show();
                    },
                    /**
                     * 선택한 문서를 삭제한다.
                     *
                     * @param {number} start_version - 문서최소버전
                     */
                    delete: (start_version) => {
                        const documents = Aui.getComponent('documents');
                        const content_id = documents.getStore().getParam('content_id');
                        Aui.Message.delete({
                            url: this.getProcessUrl('documents'),
                            params: { content_id: content_id, start_version: start_version },
                            message: this.printText('admin.documents.delete_confirm'),
                            handler: async (results) => {
                                if (results.success == true) {
                                    const documents = Aui.getComponent('documents');
                                    documents.getStore().reload();
                                }
                            },
                        });
                    },
                };
            }
            admin.Manual = Manual;
        })(admin = manual.admin || (manual.admin = {}));
    })(manual = modules.manual || (modules.manual = {}));
})(modules || (modules = {}));