import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col justify-center items-center w-full'>
        <div className="logo flex justify-center items-center font-bold text-2xl w-full">
            <span className='text-green-500'>&lt;</span>
            <span>Pass</span>
            <span className='text-green-500'>OP/&gt;</span>
        </div>
        <div className='flex justify-center items-center'>
            Created with 
            <div className='w-7 mx-2'>
                <lord-icon
                    src="https://cdn.lordicon.com/gbkitytd.json"
                    trigger="morph"
                    state="morph-heart"
                    colors="primary:#c71f16"
                    style={{"width":"25px", "height":"25px"}}>
                </lord-icon>
            </div>
            by LaibaBatool
        </div>
    </div>
  )
}

export default Footer
