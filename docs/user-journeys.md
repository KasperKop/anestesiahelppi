# MVP user journeys

These journeys describe the first mobile prototype. All examples use non-clinical placeholder content. Patient-specific recommendations, medication dosing and storage of patient data remain outside the MVP.

## Journey 1 — Select a weight and open the preparation view

**Intent:** The user wants a quick, general preparation overview for a selected weight.

**Entry point:** The home screen opens with the weight selector visible.

**Flow:**

1. The user adjusts the value with the slider or the minus and plus controls.
2. The selected value is shown in large text and announced accessibly.
3. The user opens the preparation view.
4. The application shows clearly grouped general checklist cards.
5. Critical information uses the reserved critical style and an explicit text label.

**Success state:** The selected weight and checklist context remain visible, and the user can return to the home screen without losing the selection.

**Likely error states:** Unsupported values, incomplete content, stale content or unavailable offline data produce a clear message. The application does not silently substitute clinical information.

## Journey 2 — Ask the assistant and save an answer

**Intent:** The user wants to retrieve general reference information and keep a useful answer.

**Entry point:** The assistant field on the home screen.

**Flow:**

1. The user enters a general question.
2. The application displays a concise answer with its sources, review status and timestamp.
3. The user chooses **Save to memory bank**.
4. The application confirms where the card was saved.

**Success state:** The answer is available as a personal reference card with provenance metadata.

**Likely error states:** An unsupported, patient-specific or unsafe question receives a clear limitation message. An answer without acceptable sources cannot be saved as reviewed content.

## Journey 3 — Organize saved cards into stacks

**Intent:** The user wants to arrange saved answers into personal topic stacks.

**Entry point:** The memory bank, reached through visible navigation or a left swipe from the home screen.

**Flow:**

1. The user opens the memory bank.
2. The user creates or selects a named stack.
3. A saved card is moved by drag and drop or by the accessible **Move to stack** action.
4. The new position is confirmed visually and accessibly.

**Success state:** The card appears in the selected stack and remains available after reopening the application.

**Likely error states:** Empty stack names, duplicate actions or storage failures receive clear feedback. Dragging is never the only available interaction.

## Journey 4 — Complete and reset a checklist

**Intent:** The user wants to track preparation progress without creating a patient record.

**Entry point:** An opened preparation checklist.

**Flow:**

1. The user marks individual general preparation items complete.
2. Progress is shown as text as well as visually.
3. The user can review completed and incomplete items.
4. Resetting requires an explicit confirmation and offers a short undo opportunity.

**Success state:** Progress is understandable without relying on color and can be reset safely.

**Likely error states:** Accidental reset, interrupted local storage or stale checklist content is made visible. No completion history is represented as a clinical record.

## Navigation requirements

- Swipe gestures are optional shortcuts, not the only navigation method.
- Home, preparation checklist and memory bank are reachable through visible controls.
- Back navigation is predictable and preserves unsaved input where practical.
- Every drag-and-drop action has a keyboard- and touch-accessible menu alternative.
