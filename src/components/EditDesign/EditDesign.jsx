import React, { useEffect, useState } from "react";
import CodeEditor, { SelectionText } from '@uiw/react-textarea-code-editor';
import {TextField, Button} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { html_beautify, js_beautify } from 'js-beautify';

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import designService from '../../services/design.service';
import authService from '../../services/auth.service';
import { useApp } from '../../contexts/app.context';
import "./EditDesign.css";

function EditDesign () {
    const [focused, setFocused] = useState(false);
    const [code, setCode] = useState(``);
    const [name, setName] = useState(``);
    const [jsonCode, setJsonCode] = useState(``);
    const [errMsg, setErrMsg] = useState('');
    const [errDlgOpen, setErrDlgOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgDlgOpen, setMsgDlgOpen] = useState(false);
    const [designID, setDesignID] = useState('');
    const {id} = useParams();
    const [pdfLink, setPdfLink] = useState('');
    const codeEditorRef = React.useRef();
    const jsonEditorRef = React.useRef();
    const {appState} = useApp();
    const navigate = useNavigate();
    const htmlFormatOptions = {
        "indent_size": "4",
        "indent_char": " ",
        "max_preserve_newlines": "5",
        "preserve_newlines": true,
        "keep_array_indentation": false,
        "break_chained_methods": false,
        "indent_scripts": "normal",
        "brace_style": "collapse",
        "space_before_conditional": true,
        "unescape_strings": false,
        "jslint_happy": false,
        "end_with_newline": false,
        "wrap_line_length": "0",
        "indent_inner_html": false,
        "comma_first": false,
        "e4x": false,
        "indent_empty_lines": false
    };

    useEffect(() => {
        if (codeEditorRef.current) {
          const obj = new SelectionText(codeEditorRef.current);
        }

        if (jsonEditorRef.current) {
            const obj = new SelectionText(jsonEditorRef.current);
        }
    }, []);

    useEffect(() => {
        fetchDesignByID();
    }, [id]);

    useEffect(() => {
        previewDownload();
    }, [id, jsonCode])

    const fetchDesignByID = async () => {
        try {
            const res = await designService.getDesignByID(id);
            if (res) {
                const {data} = res;
                if (data) {
                    setCode('design' in data && data.design ? html_beautify(data.design, htmlFormatOptions) : '');
                    setJsonCode('fields' in data && data.fields ? js_beautify(JSON.stringify(data.fields), htmlFormatOptions) : '');
                    setName('name' in data && data.name ? data.name : '');
                }
            }
        } catch(err) {
            setErrMsg(err?.message);
            setErrDlgOpen(true);
        }
    }
    
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    const handleSearchTermChange = (e) => {
        setName(e.target.value);
    }

    const navigateToDashboard = () => {
        navigate("/dashboard");
    }

    const validatePayload = () => {
        if (code && jsonCode && name) {
            return true;
        }

        if (!code) {
            setErrMsg('Please enter a valid golang template');
        } else if (!jsonCode) {
            setErrMsg('Please enter a valid json');
        } else if (!name) {
            setErrMsg('Please enter design name');
        }
        return false;
    }

    const validatePDF= async() => {
        if (validatePayload()) {
            const userObj = authService.getCurrentUser();

            if (userObj) {
                const payload = {
                    name,
                    design: window.btoa(code),
                    fields: JSON.parse(jsonCode),
                };
    
                try {
                    const res = await designService.validateDesign(payload);
                    const {data} = res;
            
                    if (data && 'id' in data) {
                        setMsg(data?.id);
                        setMsgDlgOpen(true);
                    }
                } catch (err) {
                    setErrMsg(err?.message);
                    setErrDlgOpen(true);
                }
            }
        } else {
            setErrDlgOpen(true);
        }
    }

    const handleSave = async () => {
        try {
            if (validatePayload()) {
                const userObj = authService.getCurrentUser();

                if (userObj) {
                    const payload = {
                        name,
                        design: window.btoa(code),
                        fields: JSON.parse(jsonCode),
                        userId: userObj.user.id
                    };
                    
                    const res = await designService.updateDesignByID(id, payload);
                    const {data} = res;
            
                    if (data && 'id' in data) {
                        setDesignID(data.id);
                        setMsg('Design updated successfully');
                        setMsgDlgOpen(true);
                        setTimeout(() => {
                            setMsgDlgOpen(false);
                        }, 2000);
                    }
                }
            } else {
                setErrDlgOpen(true);
            }
        } catch(err) {
            setErrMsg(err?.message);
            setErrDlgOpen(true);
        }
    }

    const previewDownload = async () => {
        try {
            if (id && jsonCode) {
                const payload = {
                    DesignId: id,
                    fields: JSON.parse(jsonCode),
                };
    
                const response = await designService.generatePDF(payload);
                const file = new Blob(
                    [response.data], 
                    {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                setPdfLink(fileURL);
            }
        } catch(err) {
            setErrMsg(err?.message);
            setErrDlgOpen(true);
        }
    }

    const handleDownload = async () => {
        try {
            if (id && validatePayload()) {
                const payload = {
                    DesignId: id,
                    fields: JSON.parse(jsonCode),
                };
    
                const response = await designService.generatePDF(payload);
                const temp = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = temp;
                link.setAttribute('download', `${name}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
            } else {
                setErrMsg('Please create a design before generating PDF');
                setErrDlgOpen(true);
            }
        } catch(err) {
            setErrMsg(err?.message);
            setErrDlgOpen(true);
        }
    }

    const handleClose = () => {
        setErrDlgOpen(false);
        setMsgDlgOpen(false);
    }

    return (
        <div className="add-design__wrapper">
            <TextField id="search" className="add-design__text" label="Enter design name" variant="outlined" onFocus={onFocus} onBlur={onBlur}
                value={name}
                onChange={handleSearchTermChange}
                /* styles the wrapper */
                style={{ height: 40 }}

                /* styles the label component */
                InputLabelProps={{
                    style: {
                    height: 40,
                    ...(!focused && { top: `${-6}px` }),
                    },
                }}

                /* styles the input component */
                inputProps={{
                    style: {
                        height: 40,
                        padding: '0 14px',
                    },
                }}
            />

            <div className="add-design">
                <div className={appState.sidebar ? 'add-design__editor' : 'add-design__editor full-width'}>
                    <span className="add-design__header">Supports HTML, CSS2, Golang template</span>
                    <CodeEditor
                        className="add-design__editor--area"
                        value={code}
                        ref={codeEditorRef}
                        language="html"
                        placeholder="Please enter HTML template"
                        onChange={(evn) => setCode(evn.target.value)}
                        padding={15}
                        style={{
                            fontSize: 12,
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            height: '100%',
                            borderRadius: 4
                        }}
                    />
                </div>
                <div className={appState.sidebar ? 'add-design__html' : 'add-design__html full-width'}>
                    <span className="add-design__header">JSON Data</span>
                    <CodeEditor
                        className="add-design__html--area"
                        value={jsonCode}
                        ref={jsonEditorRef}
                        language="json"
                        placeholder="Please enter JSON."
                        onChange={(evn) => setJsonCode(evn.target.value)}
                        padding={15}
                        style={{
                            fontSize: 12,
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            height: '100%',
                            borderRadius: 4
                        }}
                    />
                </div>
                <div className="add-design__action">
                    <Button variant="contained" className="custom-btn"  onClick={validatePDF}>Validate</Button>
                    <Button variant="contained" className="custom-btn"  onClick={previewDownload}>Preview</Button>
                    <Button variant="contained" className="custom-btn" onClick={handleSave}>Update</Button>
                    <Button variant="contained" className="custom-btn"  onClick={handleDownload}>Download pdf</Button>
                </div>
                <div className={appState.sidebar ? 'add-design__preview' : 'add-design__preview full-width'}>
                    <span className="add-design__header">PDF Preview</span>
                    <object width="100%" height="100%" data={pdfLink} type="application/pdf"></object>
                </div>

                <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
                <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
            </div>
        </div>
    );
}

export default EditDesign;