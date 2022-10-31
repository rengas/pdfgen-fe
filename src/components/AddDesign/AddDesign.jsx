import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import designService from '../../services/design.service';
import "./AddDesign.css";

function AddDesign () {
    const [code, setCode] = useState(``);
    const [jsonCode, setJsonCode] = useState(``);
    const [errMsg, setErrMsg] = useState('');
    const [errDlgOpen, setErrDlgOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgDlgOpen, setMsgDlgOpen] = useState(false);

    const navigate = useNavigate();

    const navigateToDashboard = () => {
        navigate("/dashboard");
    }

    const validatePayload = () => {
        if (code && jsonCode) {
            return true;
        }

        if (!code) {
            setErrMsg('Please enter a valid golang template');
        } else if (!jsonCode) {
            setErrMsg('Please enter a valid json');
        }
        return false;
    }

    const validatePDF= async() => {
        if (validatePayload()) {
            const payload = {
                name: 'Sample Name',
                profileId: "2824799f-33b0-488a-b5fc-fa279c3af17f",
                design: window.btoa(code),
                fields: JSON.parse(jsonCode),
            };

            try {
                const res = await designService.validateDesign(payload);
                const {data} = res;
        
                if (data) {
                    console.log(data);
                    setMsg(data?.Message);
                    setMsgDlgOpen(true);
                }
            } catch (err) {
                setErrMsg(err?.message);
                setErrDlgOpen(true);
            }
        } else {
            setErrDlgOpen(true);
        }
    
    }

    const handleSave = async () => {
        try {
            if (validatePayload()) {
                const payload = {
                    name: 'Sample Name',
                    profileId: "2824799f-33b0-488a-b5fc-fa279c3af17f",
                    design: window.btoa(code),
                    fields: JSON.parse(jsonCode),
                };

                
                const res = await designService.createDesign(payload);
                const {data} = res;
        
                if (data) {
                    console.log(data);
                }
            } else {
                setErrDlgOpen(true);
            }
        } catch(err) {
            setErrMsg(err?.message);
            setErrDlgOpen(true);
        }
    }

    const handleDownload = async () => {
        try {
            const payload = {
                designId:"526f77ef-cbf0-4420-b0fc-1d0ba89fd8ee"
            };

            
            const res = await designService.generatePDF(payload);
            const {data} = res;
    
            if (data) {
                console.log(data);
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
        <div className="add-design">
            <div className="add-design__editor">
                <CodeEditor
                    className="add-design__editor--area"
                    value={code}
                    language="js"
                    placeholder="Please enter golang template"
                    onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        height: '100%',
                        borderRadius: 4
                    }}
                />
            </div>
            <div className="add-design__html">
                <CodeEditor
                    className="add-design__html--area"
                    value={jsonCode}
                    language="json"
                    placeholder="Please enter JSON."
                    onChange={(evn) => setJsonCode(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        height: '100%',
                        borderRadius: 4
                    }}
                />
            </div>
            <div className="add-design__action">
                <Button variant="contained" onClick={validatePDF}>Preview</Button>
                <Button variant="contained" onClick={handleDownload}>Download pdf</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
                <Button variant="contained" onClick={navigateToDashboard}>Designs</Button>
            </div>
            <div className="add-design__preview">&nbsp;</div>

            <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
            <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
        </div>
    );
}

export default AddDesign;