import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';
import { db } from '../firebase';
import { session, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

//Editor will not work without the dynamic import because the client side uses javascript and it has access to the window
//object. But the server side which is NodeJS does not have access to window object.

const Editor = dynamic(() => import("react-draft-wysiwyg").then(module => module.Editor), {
    ssr: false
} )

function TextEditor() {
    const [session] = useSession()
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const router = useRouter()
    const { id } = router.query

    const [snapshot] = useDocumentOnce(db.collection('userDocs')
                                        .doc(session.user.email)
                                        .collection('docs')
                                        .doc(id))

    useEffect(() => {
        if(snapshot?.data()?.editorState) {
            setEditorState(EditorState.createWithContent(
                convertFromRaw(snapshot?.data()?.editorState)
            ))
        }
    }, [snapshot])

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)

        db.collection('userDocs')
            .doc(session.user.email)
            .collection('docs')
            .doc(id)
            .set({
                editorState: convertToRaw(editorState.getCurrentContent())
            }, 
            {
                merge: true
            })
    }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      <Editor 
        editorState={editorState}
        onEditorStateChange ={onEditorStateChange}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 bg-white shadow-lg max-w-5xl mx-auto mb-12 border p-10"
      />
    </div>
  )
}

export default TextEditor
