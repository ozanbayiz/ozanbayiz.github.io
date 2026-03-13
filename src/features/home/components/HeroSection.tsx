'use client'

import { useModeContext } from '@/lib/mode-context'
import ExternalLink from '@/shared/ui/external-link'

import CleanHero from './CleanHero'

export default function HeroSection() {
    const { mode, cycleMode } = useModeContext()

    if (mode === 'clean') return <CleanHero />

    return (
        <section className="relative flex flex-col items-center justify-center pt-20 pb-10 md:pt-32 md:pb-16">
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 md:px-8">
                {/* ASCII Art — the centerpiece */}
                <div
                    className="cursor-pointer text-2xs leading-tight transition-[filter] duration-300 hover:brightness-125 lg:text-sm lg:leading-tight"
                    onClick={cycleMode}
                >
                    <div className="flex flex-wrap items-center justify-around gap-x-4">
                        <pre className="ascii-gradient mb-4">
                            {'                     '}XXXXXXX{'\n'}
                            {'                     '}XXXXXXX{'\n'}
                            {'                    '}XXXXXXXX{'\n'}
                            {'                    '}XXXXXXXX{'\n'}
                            {'                    '}XX{'      '}
                            {'\n'}
                            {'           '}XXX{'       '}X{'      '}
                            {'\n'}
                            {'          '}XX X{'       '}X{'      '}
                            {'\n'}
                            {'         '}XX{'  '}XX{'      '}XX{'     '}
                            {'\n'}
                            {'         '}X{'    '}XXXXXXX X{'     '}
                            {'\n'}
                            {'        '}XX{'          '}XXX{'     '}
                            {'\n'}
                            {'        '}x{'                   '}
                            {'\n'}
                            {'        '}x{'                   '}
                            {'\n'}xxx{'     '}X{'                   '}
                            {'\n'}XXX{'    '}XX{'                   '}
                            {'\n'}XXX{'  '}XXX{'                    '}
                            {'\n'}
                            {'  '}XX X{'                      '}
                            {'\n'}
                            {'   '}XXX{'                      '}
                        </pre>
                        <pre className="ascii-gradient mb-4">
                            {' '}
                            XXX XXX{'    '}XXX XXX{'        '}XXX{'      '}XXX XXX
                            {'              '}
                            {'\n'}XXX{'   '}XXX{'        '}XXX{'     '}XXX XXX{'    '}XXX
                            {'   '}XXX{'            '}
                            {'\n'}XXX{'   '}XXX{'       '}XXX{'     '}XXX{'   '}XXX{'   '}
                            XXX{'   '}XXX{'            '}
                            {'\n'}XXX{'   '}XXX{'    '}XXX XXX{'     '}XXX XXX{'    '}XXX
                            {'   '}XXX{'            '}
                            {'\n'}XXX{'   '}XXX{'     '}XXX{'       '}XXX{'   '}XXX{'   '}
                            XXX{'   '}XXX{'            '}
                            {'\n'}XXX{'   '}XXX{'    '}XXX{'        '}XXX{'   '}XXX{'   '}
                            XXX{'   '}XXX{'            '}
                            {'\n'} XXX XXX{'      '}XXX XXX{'   '}XXX{'   '}XXX{'   '}XXX
                            {'   '}XXX{'            '}
                            {'\n'}
                            {'\n'} XXX XXX{'       '}XXX{'      '}XXX{'   '}XXX{'    '}XXX
                            XXX{'    '}XXX XXX{'  '}
                            {'\n'}XXX{'   '}XXX{'    '}XXX XXX{'    '}XXX{'   '}XXX
                            {'      '}XXX{'           '}XXX {'\n'}XXX{'   '}XXX{'   '}XXX
                            {'   '}XXX{'    '}XXX XXX{'       '}XXX{'          '}XXX{'  '}
                            {'\n'} XXX XXX{'     '}XXX XXX{'       '}XXX{'         '}XXX
                            {'       '}XXX XXX {'\n'}XXX{'   '}XXX{'   '}XXX{'   '}XXX{'      '}XXX
                            {'         '}XXX{'        '}XXX{'    '}
                            {'\n'}XXX{'   '}XXX{'   '}XXX{'   '}XXX{'      '}XXX
                            {'         '}XXX{'       '}XXX{'     '}
                            {'\n'} XXX XXX{'    '}XXX{'   '}XXX{'      '}XXX{'       '}XXX
                            XXX{'      '}XXX XXX{'\n'}
                        </pre>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-32 bg-foreground" />

                {/* Subtitle */}
                <p className="text-sm text-foreground">
                    CS @ Berkeley
                </p>

                {/* Social links */}
                <div className="flex items-center gap-4">
                    <ExternalLink
                        href="https://github.com/ozanbayiz"
                        aria-label="GitHub profile"
                        icon
                        className="text-foreground transition-[color,transform] hover:text-accent1 hover:scale-110"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                        >
                            <path d="M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z" />
                        </svg>
                    </ExternalLink>

                    <ExternalLink
                        href="https://linkedin.com/in/ozanbayiz"
                        aria-label="LinkedIn profile"
                        icon
                        className="text-foreground transition-[color,transform] hover:text-accent1 hover:scale-110"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                        >
                            <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" />
                        </svg>
                    </ExternalLink>

                    <ExternalLink
                        href="/ozanbayiz_cv.pdf"
                        aria-label="Resume"
                        icon
                        className="text-foreground transition-[color,transform] hover:text-accent1 hover:scale-110"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5 fill-current"
                            viewBox="0 0 26 28"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                        >
                            <path d="M3 24h19v-23h-1v22h-18v1zm17-24h-18v22h18v-22zm-1 1h-16v20h16v-20zm-2 16h-12v1h12v-1zm0-3h-12v1h12v-1zm0-3h-12v1h12v-1zm-7.348-3.863l.948.3c-.145.529-.387.922-.725 1.178-.338.257-.767.385-1.287.385-.643 0-1.171-.22-1.585-.659-.414-.439-.621-1.04-.621-1.802 0-.806.208-1.432.624-1.878.416-.446.963-.669 1.642-.669.592 0 1.073.175 1.443.525.221.207.386.505.496.892l-.968.231c-.057-.251-.177-.449-.358-.594-.182-.146-.403-.218-.663-.218-.359 0-.65.129-.874.386-.223.258-.335.675-.335 1.252 0 .613.11 1.049.331 1.308.22.26.506.39.858.39.26 0 .484-.082.671-.248.187-.165.322-.425.403-.779zm3.023 1.78l-1.731-4.842h1.06l1.226 3.584 1.186-3.584h1.037l-1.734 4.842h-1.044z" />
                        </svg>
                    </ExternalLink>

                    <span className="mx-1 h-4 w-px bg-foreground" />

                    <a
                        className="gradient-link text-xs"
                        href="mailto:ozanbayiz@berkeley.edu"
                    >
                        ozanbayiz@berkeley.edu
                    </a>
                </div>
            </div>
        </section>
    )
}
