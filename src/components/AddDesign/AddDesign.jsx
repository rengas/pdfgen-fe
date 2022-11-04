import React, { useEffect, useState } from "react";
import CodeEditor, { SelectionText } from '@uiw/react-textarea-code-editor';
import {TextField, Button} from '@mui/material';
import { useNavigate } from "react-router-dom";

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import designService from '../../services/design.service';
import authService from '../../services/auth.service';
import { useApp } from '../../contexts/app.context';
import "./AddDesign.css";

function AddDesign () {
    const [focused, setFocused] = useState(false);
    const [code, setCode] = useState(`<!doctype html>
<html lang=en>
    <head>
        <meta charset=utf-8>
        <title>Sample HTML</title>
    </head>
    <body>
        <h1>{{ .title }}</h1>
    </body>
</html>`);
    const [name, setName] = useState(``);
    const [jsonCode, setJsonCode] = useState(`{"title": "Hello World"}`);
    const [errMsg, setErrMsg] = useState('');
    const [errDlgOpen, setErrDlgOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgDlgOpen, setMsgDlgOpen] = useState(false);
    const [designID, setDesignID] = useState('');
    const [pdfLink, setPdfLink] = useState('http://www.xmlpdf.com/manualfiles/hello-world.pdf');
    const codeEditorRef = React.useRef();
    const {appState} = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (codeEditorRef.current) {
          const obj = new SelectionText(codeEditorRef.current);
        }
      }, []);
    
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
                    
                    const res = await designService.createDesign(payload);
                    const {data} = res;
            
                    if (data && 'id' in data) {
                        setDesignID(data.id);
                        setMsg('Design saved successfully');
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
            if (designID && jsonCode) {
                const payload = {
                    DesignId: designID,
                    fields: JSON.parse(jsonCode),
                };
    
                const response = await designService.generatePDF(payload);
                const file = new Blob(
                    [response.data], 
                    {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                setPdfLink(fileURL);
            } else {
                setErrMsg('Please create a design before generating PDF');
                setErrDlgOpen(true);
            }
        } catch(err) {
            setErrMsg(err?.message);
            setErrDlgOpen(true);
        }
    }

    const handleDownload = async () => {
        try {
            if (designID) {
                const payload = {
                    DesignId: designID,
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
                <div data-color-mode="dark" className={appState.sidebar ? 'add-design__editor' : 'add-design__editor full-width'}>
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
                            borderRadius: 4
                        }}
                    />
                </div>
                <div className={appState.sidebar ? 'add-design__html' : 'add-design__html full-width'}>
                    <CodeEditor
                        className="add-design__html--area"
                        value={jsonCode}
                        language="json"
                        placeholder="Please enter JSON."
                        onChange={(evn) => setJsonCode(evn.target.value)}
                        padding={15}
                        style={{
                            fontSize: 12,
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            borderRadius: 4
                        }}
                    />
                </div>
                <div className="add-design__action">
                    <Button className="custom-btn" variant="contained" onClick={validatePDF}>Validate</Button>
                    <Button className="custom-btn" variant="contained" onClick={previewDownload}>Preview</Button>
                    <Button className="custom-btn" variant="contained" onClick={handleSave}>Save</Button>
                    <Button className="custom-btn" variant="contained" onClick={handleDownload}>Download pdf</Button>
                </div>
                <div className={appState.sidebar ? 'add-design__preview' : 'add-design__preview full-width'}>
                    <object width="100%" height="100%" data={pdfLink} type="application/pdf"></object>
                </div>

                <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
                <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
            </div>
        </div>
    );
}

export default AddDesign;