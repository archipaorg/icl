declare module 'jison' {
    interface JisonMap {
        [s: number]: string
    }
    interface JisonLex {
        macro: any,
        options:any,
        startConditions:any,
        rules: any
    }
    interface JisonBNF {
        configuration_file: Array<JisonMap>;
        configuration_file_content: Array<JisonMap>;
        settings_block: Array<JisonMap>;
        alias: Array<JisonMap>;
        hierarchy_levels: Array<JisonMap>;
        parent_block_list: Array<JisonMap>;
        param_list: Array<JisonMap>;
        param_value_list: Array<JisonMap>;
        settings_block_value: Array<JisonMap>;
        config_block: Array<JisonMap>;
        config_block_content: Array<JisonMap>;
        list: Array<JisonMap>;
        list_elements: Array<JisonMap>;
        list_element: Array<JisonMap>;
        list_settings_subblock: Array<JisonMap>;
        import_block: Array<JisonMap>;
        import_list: Array<JisonMap>;
    }

    class Parser {
        yy: any;
        constructor(configuration:any);
        parse(input: string):any;
    }
}