import React from 'react'
import { useTranslation } from 'react-i18next';

export const TermConditions = () => {
  const { t } = useTranslation();
  return (
    <div className="spacer-x">
      <div className="pt-20 pb-5 border-b border-gray-200">
        <h1 className="main-heading">{t("souqSyriaTerms")}</h1>
      </div>
      <div className="py-6">
        <h3 className="font-bold text-xl pt-4">Lorem ipsum dolor sit amet?</h3>
        <p className="text-gray-700 py-1">Lorem ipsum dolor sit amet consectetur. Adipiscing elementum sed sem sed. Bibendum donec netus vel aenean nunc sed nulla elementum. Mattis viverra risus duis tristique. Posuere ut nascetur sed fermentum diam urna sed. Urna ultrices aliquam sagittis sit velit orci volutpat mattis nulla. Vestibulum faucibus lectus lacinia luctus non facilisi gravida arcu.</p>

        <h3 className="font-bold text-xl pt-4">Lorem ipsum dolor sit amet?</h3>
        <p className="text-gray-700 py-1">Lorem ipsum dolor sit amet consectetur. Adipiscing elementum sed sem sed. Bibendum donec netus vel aenean nunc sed nulla elementum. Mattis viverra risus duis tristique. Posuere ut nascetur sed fermentum diam urna sed. Urna ultrices aliquam sagittis sit velit orci volutpat mattis nulla. Vestibulum faucibus lectus lacinia luctus non facilisi gravida arcu.</p>

        <h3 className="font-bold text-xl pt-4">Lorem ipsum dolor sit amet?</h3>
        <p className="text-gray-700 py-1">Lorem ipsum dolor sit amet consectetur. Adipiscing elementum sed sem sed. Bibendum donec netus vel aenean nunc sed nulla elementum. Mattis viverra risus duis tristique. Posuere ut nascetur sed fermentum diam urna sed. Urna ultrices aliquam sagittis sit velit orci volutpat mattis nulla. Vestibulum faucibus lectus lacinia luctus non facilisi gravida arcu.</p>
      </div>
    </div>
  )
}
