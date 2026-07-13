export type QualificationAnswers = {
  contractorType: string;
  crewCount: string;
  timeline: string;
  marketingBudget: string;
  annualRevenue: string;
  firstName: string;
  phone: string;
};

export type AttributionParams = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  fbclid: string;
};

export type SubmitQuizSuccess = {
  success: true;
  contactId: string;
  warnings: string[];
};

export type SubmitQuizFailure = {
  success: false;
  error: string;
};

export type SubmitQuizResult = SubmitQuizSuccess | SubmitQuizFailure;

export function getAttributionFromLocation(): AttributionParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_content: params.get('utm_content') ?? '',
    fbclid: params.get('fbclid') ?? '',
  };
}

/**
 * Submits completed quiz answers to the secure Netlify function,
 * which upserts the contact in GoHighLevel using server-side credentials.
 */
export async function submitContractorQuiz(
  answers: QualificationAnswers,
  attribution?: AttributionParams,
): Promise<SubmitQuizResult> {
  const attrs = attribution ?? getAttributionFromLocation();

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch('/.netlify/functions/submit-contractor-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: answers.firstName.trim(),
        phone: answers.phone.trim(),
        contractorType: answers.contractorType,
        crewCount: answers.crewCount,
        timeline: answers.timeline,
        marketingBudget: answers.marketingBudget,
        annualRevenue: answers.annualRevenue,
        ...attrs,
      }),
      signal: controller.signal,
    });

    let payload: SubmitQuizResult | null = null;
    try {
      payload = (await response.json()) as SubmitQuizResult;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        error:
          (payload && 'error' in payload && payload.error) ||
          'We couldn’t save your information. Please try again.',
      };
    }

    return payload;
  } catch {
    return {
      success: false,
      error: 'We couldn’t save your information. Please try again.',
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
