
import React, { useState, useEffect } from 'react';
import { AppState, UserResponses, BranchResult, BranchCode } from './types';
import { SYMBOLIC_QUESTIONS, THEMES, BRANCH_NAMES } from './constants';
import { generateAdvancedInsight } from './services/geminiService';
import { GlassCard } from './components/GlassCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [responses, setResponses] = useState<UserResponses>({ name: '' });
  const [result, setResult] = useState<BranchResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [interpretationStep, setInterpretationStep] = useState(0);
  const [showAcademic, setShowAcademic] = useState(false);

  const INTERPRETATION_TEXTS = [
    "Reading cognitive patterns...",
    "Identifying learning preferences...",
    "Simulating engineering scenarios...",
    "Aligning insights with MIT Muzaffarpur branches..."
  ];

  const handleStart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setState(AppState.NAME_INPUT);
      setIsTransitioning(false);
    }, 500);
  };

  const handleContinueToQuestions = () => {
    if (!userName.trim()) return;
    setResponses(prev => ({ ...prev, name: userName }));
    setIsTransitioning(true);
    setTimeout(() => {
      setState(AppState.QUESTIONS);
      setIsTransitioning(false);
    }, 500);
  };

  const handleSelectTrait = (optionIndex: number) => {
    const currentQuestion = SYMBOLIC_QUESTIONS[currentQuestionIndex];
    const selectedOption = currentQuestion.options[optionIndex];
    setResponses(prev => ({ ...prev, [currentQuestion.id]: selectedOption.text }));
    
    if (currentQuestionIndex < SYMBOLIC_QUESTIONS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 350);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setState(AppState.CONFIDENCE_CHECK);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleConfidence = (val: string) => {
    setResponses(prev => ({ ...prev, confidence: val }));
    handleFinalize();
  };

  const handleFinalize = async () => {
    setState(AppState.INTERPRETING);
    
    // Weighted scoring logic
    const scores: Record<BranchCode, number> = {
      CSE: 0, IT: 0, ECE: 0, ME: 0, CE: 0, EEE: 0
    };

    SYMBOLIC_QUESTIONS.forEach(q => {
      const selectedText = responses[q.id];
      const option = q.options.find(o => o.text === selectedText);
      if (option && option.weights) {
        Object.entries(option.weights).forEach(([code, weight]) => {
          scores[code as BranchCode] += weight || 0;
        });
      }
    });

    if (responses.confidence === 'not-really') {
      scores.IT += 1.5;
      scores.ECE += 1.5;
    }

    const sortedScores = (Object.keys(scores) as BranchCode[])
      .map(code => ({ code, score: scores[code] }))
      .sort((a, b) => b.score - a.score);

    const topBranch = sortedScores[0].code;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < INTERPRETATION_TEXTS.length) {
        setInterpretationStep(step);
      } else {
        clearInterval(interval);
      }
    }, 900);

    try {
      const generated = await generateAdvancedInsight(userName, topBranch, sortedScores, responses);
      setTimeout(() => {
        setResult(generated);
        setState(AppState.RESULT);
      }, 3600);
    } catch (err) {
      console.error("Failed to generate insight", err);
      // Fallback or restart logic could go here
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const shareData = {
      title: 'Palm Insight Summary',
      text: `My cognitive analysis suggests I'm a perfect fit for ${result.suggestedBranch} at MIT Muzaffarpur!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\nGenerated via Palm Insight.`);
        alert("Summary copied to clipboard!");
      }
    } catch (err) {
      console.debug("Share failed", err);
    }
  };

  const currentTheme = result?.colorTheme as keyof typeof THEMES || 'default';
  const themeClass = THEMES[currentTheme] || THEMES.default;
  const currentQ = SYMBOLIC_QUESTIONS[currentQuestionIndex];

  return (
    <div className={`min-h-screen transition-all duration-1000 bg-gradient-to-br ${themeClass} flex items-center justify-center p-4 md:p-8 overflow-hidden`}>
      <div className="max-w-xl w-full relative z-10 h-full flex flex-col justify-center">
        
        {state === AppState.WELCOME && (
          <div className={`text-center space-y-10 transition-all duration-700 ${isTransitioning ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}>
            <div className="flex justify-center">
              <div className="w-28 h-28 bg-white/40 rounded-[2rem] flex items-center justify-center backdrop-blur-md shadow-lg border border-white/50 animate-pulse">
                <svg className="w-14 h-14 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-serif text-6xl md:text-8xl font-bold text-slate-800 tracking-tight leading-none">
                Palm Insight
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                Discover your engineering path through cognitive patterns.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="mt-8 px-14 py-6 bg-slate-900 text-white rounded-full text-xl font-medium hover:bg-slate-800 transition-all shadow-2xl hover:shadow-indigo-200/50 active:scale-95 flex items-center gap-3 mx-auto group"
            >
              Begin Insight
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {state === AppState.NAME_INPUT && (
          <GlassCard className={isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 block ml-1">Identity Profile</label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleContinueToQuestions()}
                  className="w-full px-7 py-6 bg-[#F5F5F5] border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-slate-200/50 transition-all text-left text-3xl font-serif text-black placeholder:text-slate-300"
                />
              </div>
              <p className="text-slate-400 text-base font-light italic min-h-[1.5rem] leading-relaxed">
                {userName ? `Preparing a high-fidelity insight for ${userName.split(' ')[0]}...` : "Personalizing the cognitive alignment sequence."}
              </p>
              <button
                onClick={handleContinueToQuestions}
                disabled={!userName.trim()}
                className="w-full py-6 bg-slate-900 text-white rounded-full text-xl font-medium shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </GlassCard>
        )}

        {state === AppState.QUESTIONS && (
          <GlassCard className={isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-1">{currentQ.phase}</span>
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Profile: {userName}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                     <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / SYMBOLIC_QUESTIONS.length) * 100}%` }} />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{currentQuestionIndex + 1} / {SYMBOLIC_QUESTIONS.length}</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif font-medium text-slate-800 leading-[1.2]">
                {currentQ.text}
              </h2>

              <div className="grid grid-cols-1 gap-4 pt-2">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTrait(idx)}
                    className="w-full text-left px-8 py-6 rounded-[2rem] border border-slate-100 hover:border-slate-300 hover:bg-white/95 transition-all text-slate-700 font-medium group flex justify-between items-center shadow-sm"
                  >
                    <span className="text-xl leading-snug pr-4">{option.text}</span>
                    <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {state === AppState.CONFIDENCE_CHECK && (
          <GlassCard className="animate-in fade-in zoom-in duration-500">
            <div className="space-y-10 text-center">
              <div className="space-y-3">
                <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">Verification Sequence</span>
                <h2 className="text-4xl font-serif text-slate-800 font-bold">Self-Reflection</h2>
                <p className="text-slate-500 text-xl font-light">Does the data captured so far reflect your true problem-solving nature?</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => handleConfidence('yes')} className="w-full py-5 bg-slate-900 text-white rounded-3xl text-lg font-medium shadow-2xl hover:bg-slate-800 transition-all">✅ Yes, It Aligns</button>
                <button onClick={() => handleConfidence('partially')} className="w-full py-5 bg-white border border-slate-200 text-slate-700 rounded-3xl text-lg font-medium hover:bg-slate-50 transition-all">⚖️ Partially</button>
                <button onClick={() => handleConfidence('not-really')} className="w-full py-5 bg-white border border-slate-200 text-slate-700 rounded-3xl text-lg font-medium hover:bg-slate-50 transition-all">❌ Not Really</button>
              </div>
            </div>
          </GlassCard>
        )}

        {state === AppState.INTERPRETING && (
          <div className="text-center space-y-16 py-12">
            <div className="relative flex justify-center scale-125 md:scale-150">
              <div className="absolute inset-0 animate-ping rounded-full h-24 w-24 bg-slate-200 mx-auto opacity-10"></div>
              <div className="relative z-10 animate-spin-slow rounded-full h-24 w-24 border-t-2 border-slate-800 bg-white shadow-2xl flex items-center justify-center">
                 <svg className="w-8 h-8 text-slate-800 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.022.547l-2.387 2.387a2 2 0 001.414 3.414h15.828a2 2 0 001.414-3.414l-2.387-2.387zM12 2a5 5 0 00-5 5v3a5 5 0 0010 0V7a5 5 0 00-5-5z" /></svg>
              </div>
            </div>
            <p className="text-3xl font-serif italic text-slate-600 animate-in slide-in-from-bottom-4 duration-1000">
              {INTERPRETATION_TEXTS[interpretationStep]}
            </p>
          </div>
        )}

        {state === AppState.RESULT && result && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-1000 max-h-[92vh] overflow-y-auto no-scrollbar pb-16 pt-4">
            <GlassCard className="border-white/40 px-6 md:px-10">
              <div className="space-y-12 text-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-[0.5em] text-slate-400 uppercase">Analysis Results</span>
                  <div className="h-[2px] w-24 bg-slate-200 mx-auto" />
                  <h4 className="text-xl font-medium text-slate-600 font-serif leading-relaxed px-4">
                    {result.userName}, you are a <span className="text-slate-900 font-bold block text-2xl mt-1 underline decoration-slate-200 underline-offset-8">{result.personalitySummary}</span>
                  </h4>
                </div>

                <div className="space-y-5">
                  <p className="text-slate-400 font-light leading-relaxed max-w-xs mx-auto text-sm uppercase tracking-widest">
                    Primary Alignment:
                  </p>
                  <div className="inline-block px-10 py-6 bg-slate-900 rounded-[2.5rem] text-white font-serif text-2xl md:text-4xl font-bold shadow-2xl animate-float">
                    {result.suggestedBranch}
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">MIT Muzaffarpur</p>
                </div>

                <div className="bg-white/60 p-8 rounded-[2.5rem] text-left space-y-8 border border-white/80 shadow-inner">
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Personal Insight Profile</h4>
                    <ul className="space-y-4">
                      {result.reasoningBullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-4">
                           <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                             <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <span className="text-slate-700 text-base font-medium leading-snug">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3 pt-8 border-t border-slate-200/40">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Contextual Summary</h4>
                    <p className="text-slate-600 text-base italic font-light leading-relaxed">"{result.reasoning}"</p>
                  </div>
                </div>

                <div className="space-y-6 px-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Branch Match Probability</h4>
                  <div className="space-y-4">
                    {result.comparisons.map((comp) => (
                      <div key={comp.code} className="flex items-center gap-5 bg-white/40 px-6 py-4 rounded-[1.5rem] border border-white/60">
                        <span className="text-sm font-bold text-slate-800 w-14">{comp.code}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-[2000ms] ${comp.level === 'High' ? 'bg-slate-800 w-full' : (comp.level === 'Medium' ? 'bg-slate-400 w-2/3' : 'bg-slate-200 w-1/4')}`} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${comp.level === 'High' ? 'text-slate-800' : 'text-slate-400'}`}>{comp.level} Match</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200/50 space-y-8">
                   <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleShare} 
                        className="w-full flex items-center justify-center gap-3 py-5 bg-slate-100 text-slate-800 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        Share Insight
                      </button>
                      
                      <div className="flex justify-between px-2">
                        <button onClick={() => setShowAcademic(!showAcademic)} className="text-[10px] font-bold text-slate-400 hover:text-slate-800 uppercase tracking-widest transition-colors py-2">Faculty View</button>
                        <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-slate-400 hover:text-slate-800 uppercase tracking-widest transition-colors py-2">Recalibrate</button>
                      </div>
                   </div>
                   
                   {showAcademic && (
                     <div className="text-[12px] text-slate-500 font-light leading-relaxed bg-slate-50 p-8 rounded-[2rem] border border-slate-200 text-left animate-in slide-in-from-top-4">
                        <span className="font-bold block mb-3 text-slate-800 uppercase tracking-widest text-[10px]">Heuristic Decision Logic:</span>
                        {result.academicExplanation}
                        <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col gap-2">
                           <p className="font-semibold text-slate-700">Algorithm Framework:</p>
                           <p>Weighted qualitative vector mapping via structured self-reflection scenarios.</p>
                        </div>
                     </div>
                   )}

                   <div className="space-y-2 opacity-50">
                     <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Educational Simulation Model</p>
                     <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto italic">
                       MIT Muzaffarpur Series • 2025 Edition
                     </p>
                   </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Persistent Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className={`absolute top-[-15%] right-[-15%] w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[160px] transition-all duration-[2000ms] ${state === AppState.RESULT ? 'scale-110 opacity-60' : 'opacity-30'}`} />
        <div className={`absolute bottom-[-20%] left-[-20%] w-[90%] h-[90%] bg-indigo-100/30 rounded-full blur-[180px] transition-all duration-[2000ms] ${state === AppState.RESULT ? 'scale-110 opacity-50' : 'opacity-20'}`} />
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
