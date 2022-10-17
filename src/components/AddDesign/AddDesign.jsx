import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

import { getHostName } from '../../api/apiClient';
import axios from 'axios';
import "./AddDesign.css";

function AddDesign () {
    const [code, setCode] = useState(
        `function add(a, b) {\n  return a + b;\n}`
    );

    const [jsonCode, setJsonCode] = useState(
        `"{"name":"hello","age":"27"}"`
    );

    const navigate = useNavigate();

    const navigateToDashboard = () => {
        navigate("/dashboard");
    }

    const handleSave = async () => {
        const URL = `${getHostName()}/design`;
        const authToken = sessionStorage.getItem('token');
        const payload = {};
        if (authToken) {
            const config = {
                headers: { Authorization: `Bearer ${authToken}`,  'Content-Type': 'application/json' }
            };
            const res = await axios.post(URL, payload, config);
            const {data} = res;
    
            if (data) {
                console.log(data);
            }
        }
    }

    return (
        <div className="add-design">
            <div className="add-design__editor">
                <CodeEditor
                    value={code}
                    language="js"
                    placeholder="Please go lang template"
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
                <Button variant="contained">Preview</Button>
                <Button variant="contained">Download pdf</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
                <Button variant="contained" onClick={navigateToDashboard}>Designs</Button>
            </div>
            <div className="add-design__preview">&nbsp;</div>
        </div>
    );
}

export default AddDesign;