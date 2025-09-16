import React from 'react'

export const Faq = ({faqs}) => {
  return (
    <div className='pb-15'>
        {faqs.map((item,i)=> (
            <div key={i} className='py-3'>
                <h2 className='text-xl font-bold'>{i+1}. {item.question}</h2>
                <p className='text-gray-700'>{item.Answer}</p>
            </div>
        ))}
    </div>
  )
}
