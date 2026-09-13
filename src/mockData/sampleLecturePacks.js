export const SAMPLE_LECTURES = [
  {
    id: "neurobiology-201",
    course: "BIO 201: Cellular Neurobiology",
    title: "Lecture 04: Synaptic Plasticity & Neurotransmission",
    fileName: "Lecture_04_Synapses_2026.pdf",
    fileSize: "4.2 MB",
    readTime: "7 min read",
    pagesParsed: 28,
    overview: "This lecture covers the molecular mechanisms of chemical synapses, action potential propagation, calcium-dependent neurotransmitter exocytosis, and Long-Term Potentiation (LTP) in hippocampal memory formation.",
    topics: ["Chemical Synapses", "Ca2+ Exocytosis", "LTP Mechanism", "NMDA & AMPA Receptors"],
    notes: [
      {
        id: "sec-1",
        sectionTitle: "1. Fundamentals of Chemical Synapses & Action Potentials",
        summary: "Chemical synapses transmit electrical signals across synaptic clefts (~20-40nm wide) using specialized chemical messengers called neurotransmitters.",
        bullets: [
          "Presynaptic terminal depolarization opens voltage-gated Ca2+ channels.",
          "Rapid Ca2+ influx binds synaptotagmin, triggering SNARE complex assembly.",
          "Synaptic vesicles fuse with presynaptic membrane, releasing neurotransmitters via exocytosis into the synaptic cleft.",
          "Neurotransmitters diffuse across the cleft to bind ionotropic or metabotropic receptors on the postsynaptic membrane."
        ],
        keyTakeaway: "⚡ Ca2+ influx at the presynaptic terminal is the obligatory trigger for neurotransmitter exocytosis.",
        concepts: [
          { term: "Action Potential Threshold", definition: "The critical membrane potential (typically -55mV) required to initiate an all-or-none action potential." },
          { term: "SNARE Complex", definition: "Vesicle (v-SNARE / synaptobrevin) and target (t-SNARE / syntaxin & SNAP-25) proteins mediating membrane fusion." }
        ]
      },
      {
        id: "sec-2",
        sectionTitle: "2. Long-Term Potentiation (LTP) & Synaptic Plasticity",
        summary: "Long-Term Potentiation (LTP) is a persistent strengthening of synapses based on recent patterns of activity, serving as the cellular basis for learning and memory.",
        bullets: [
          "Basal Transmission: Low-frequency stimulation releases glutamate, activating AMPA receptors (Na+ influx) while NMDA receptors remain blocked by Mg2+ ions.",
          "High-Frequency Stimulation (Tetani): Strong postsynaptic depolarization expels the Mg2+ plug from the NMDA receptor pore.",
          "Ca2+ Influx through NMDA Receptors: Activates CaMKII and Protein Kinase C (PKC) signaling cascades.",
          "Exocytosis of New AMPA Receptors: Inserts additional AMPARs into the postsynaptic density, increasing synaptic sensitivity to future glutamate release."
        ],
        keyTakeaway: "🧠 NMDA receptors function as molecular coincidence detectors requiring both glutamate binding AND postsynaptic depolarization.",
        comparisonTable: {
          headers: ["Feature", "AMPA Receptor", "NMDA Receptor"],
          rows: [
            ["Primary Permeable Ion", "Na+ (Sodium influx)", "Ca2+ (Calcium influx)"],
            ["Voltage Block", "No Mg2+ block at rest", "Blocked by Mg2+ at resting Vm (-70mV)"],
            ["Role in Synapse", "Fast synaptic transmission", "Plasticity trigger & coincidence detector"],
            ["Antagonist", "CNQX", "APV (AP5)"]
          ]
        }
      },
      {
        id: "sec-3",
        sectionTitle: "3. Inhibitory vs Excitatory Neurotransmission & Exam Takeaways",
        summary: "Excitatory post-synaptic potentials (EPSPs) depolarize the cell towards threshold, while inhibitory post-synaptic potentials (IPSPs) hyperpolarize or clamp the membrane.",
        bullets: [
          "Glutamate is the primary excitatory neurotransmitter in the central nervous system.",
          "GABA (Gamma-aminobutyric acid) is the primary inhibitory neurotransmitter, opening Cl- channels to hyperpolarize postsynaptic neurons.",
          "Spatial & Temporal Summation determine whether threshold is reached at the axon hillock."
        ],
        keyTakeaway: "🎯 High-Yield Exam Tip: Questions frequently test the mechanism of NMDA receptor unblocking (depolarization removes Mg2+)."
      }
    ],
    quiz: [
      {
        id: 1,
        conceptTag: "Exocytosis Mechanism",
        bloomLevel: "Comprehension",
        question: "Which ion influx is directly required to trigger neurotransmitter exocytosis at the presynaptic terminal during an action potential?",
        options: [
          { id: "A", text: "Na+ (Sodium) influx through voltage-gated sodium channels" },
          { id: "B", text: "Ca2+ (Calcium) influx through voltage-gated calcium channels" },
          { id: "C", text: "K+ (Potassium) efflux through leak channels" },
          { id: "D", text: "Cl- (Chloride) influx through GABA-A receptor channels" }
        ],
        correctId: "B",
        explanation: "Correct! Calcium (Ca2+) influx through presynaptic voltage-gated Ca2+ channels activates synaptotagmin, triggering SNARE-mediated synaptic vesicle fusion (Slide 14)."
      },
      {
        id: 2,
        conceptTag: "NMDA Receptors",
        bloomLevel: "Analysis",
        question: "Why are NMDA receptors unable to conduct significant Ca2+ currents at normal resting membrane potential (-70mV), even in the presence of glutamate?",
        options: [
          { id: "A", text: "Glutamate cannot bind to NMDA receptors at negative membrane potentials." },
          { id: "B", text: "Extracellular Mg2+ (Magnesium) ions electrostatically block the receptor pore at resting potential." },
          { id: "C", text: "SNARE proteins prevent NMDA receptor insertion into the membrane at rest." },
          { id: "D", text: "NMDA receptors require GABA co-activation to open." }
        ],
        correctId: "B",
        explanation: "Correct! At resting potential (-70mV), extracellular Mg2+ ions are drawn into the NMDA channel pore by the negative interior potential, physically blocking ion flow until postsynaptic depolarization expels the Mg2+ plug (Slide 19)."
      },
      {
        id: 3,
        conceptTag: "LTP Expression",
        bloomLevel: "Knowledge",
        question: "What is the primary postsynaptic structural change responsible for sustaining Long-Term Potentiation (LTP)?",
        options: [
          { id: "A", text: "Degradation of presynaptic voltage-gated calcium channels" },
          { id: "B", text: "Insertion of additional AMPA receptors into the postsynaptic density" },
          { id: "C", text: "Complete destruction of the synaptic cleft" },
          { id: "D", text: "Conversion of glutamate into GABA" }
        ],
        correctId: "B",
        explanation: "Correct! Ca2+ influx through NMDA receptors activates CaMKII, which drives the exocytosis and insertion of additional AMPA receptors into the postsynaptic membrane, increasing sensitivity to future glutamate (Slide 22)."
      },
      {
        id: 4,
        conceptTag: "Inhibitory Neurotransmission",
        bloomLevel: "Application",
        question: "Activation of ionotropic GABA-A receptors causes which of the following postsynaptic events?",
        options: [
          { id: "A", text: "Cl- (Chloride) influx causing hyperpolarization (IPSP)" },
          { id: "B", text: "Na+ (Sodium) influx causing rapid depolarization (EPSP)" },
          { id: "C", text: "Immediate expulsion of Mg2+ from NMDA receptors" },
          { id: "D", text: "Inhibition of synaptotagmin binding" }
        ],
        correctId: "A",
        explanation: "Correct! GABA-A receptors are ionotropic Cl- channels. Opening them allows Cl- influx down its electrochemical gradient, hyperpolarizing the postsynaptic neuron and generating an IPSP (Slide 25)."
      },
      {
        id: 5,
        conceptTag: "Coincidence Detection",
        bloomLevel: "Evaluation",
        question: "NMDA receptors are described as 'molecular coincidence detectors' because their activation requires which simultaneous pair of conditions?",
        options: [
          { id: "A", text: "Presynaptic Na+ depletion AND postsynaptic Ca2+ efflux" },
          { id: "B", text: "Glutamate neurotransmitter binding AND postsynaptic membrane depolarization" },
          { id: "C", text: "GABA release AND presynaptic vesicle recycling" },
          { id: "D", text: "APV binding AND syntaxin phosphorylation" }
        ],
        correctId: "B",
        explanation: "Correct! NMDA receptors require BOTH glutamate binding (signaling presynaptic activity) AND postsynaptic depolarization (removing the Mg2+ block, signaling postsynaptic activity) occurring coincidentally (Slide 20)."
      }
    ]
  },
  {
    id: "econ-201",
    course: "ECON 201: Microeconomics",
    title: "Lecture 08: Market Equilibrium & Price Elasticity of Demand",
    fileName: "Econ201_Elasticity_and_Equilibrium.pdf",
    fileSize: "2.8 MB",
    readTime: "5 min read",
    pagesParsed: 18,
    overview: "Covers market equilibrium determination, consumer surplus, price elasticity of demand formulas, and government price ceiling interventions.",
    topics: ["Price Elasticity", "Market Equilibrium", "Consumer Surplus", "Deadweight Loss"],
    notes: [
      {
        id: "sec-e1",
        sectionTitle: "1. Price Elasticity of Demand (PED) Formula",
        summary: "Price elasticity measures how responsive the quantity demanded of a good is to a change in its price.",
        bullets: [
          "PED Formula: % Change in Quantity Demanded / % Change in Price",
          "Midpoint Method: ((Q2 - Q1) / ((Q1 + Q2) / 2)) / ((P2 - P1) / ((P1 + P2) / 2))",
          "Elastic Demand (|PED| > 1): Quantity changes by a larger percentage than price.",
          "Inelastic Demand (|PED| < 1): Quantity changes by a smaller percentage than price."
        ],
        keyTakeaway: "📊 Total Revenue Rule: When demand is elastic, a price drop increases total revenue.",
        concepts: [
          { term: "Unitary Elasticity", definition: "When |PED| = 1, percentage change in quantity equals percentage change in price." },
          { term: "Deadweight Loss", definition: "The loss of economic efficiency when equilibrium for a good is not achieved." }
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        conceptTag: "Price Elasticity",
        bloomLevel: "Application",
        question: "If a 10% increase in the price of coffee leads to a 20% drop in quantity demanded, what is the Price Elasticity of Demand (PED)?",
        options: [
          { id: "A", text: "0.5 (Inelastic)" },
          { id: "B", text: "2.0 (Elastic)" },
          { id: "C", text: "1.0 (Unit Elastic)" },
          { id: "D", text: "-0.5 (Perfectly Inelastic)" }
        ],
        correctId: "B",
        explanation: "Correct! PED = |% ΔQ / % ΔP| = |-20% / +10%| = 2.0. Since |PED| > 1, demand is elastic."
      },
      {
        id: 2,
        conceptTag: "Total Revenue",
        bloomLevel: "Comprehension",
        question: "If demand for a product is inelastic (|PED| < 1), raising the price will have what effect on total revenue?",
        options: [
          { id: "A", text: "Total revenue will decrease." },
          { id: "B", text: "Total revenue will increase." },
          { id: "C", text: "Total revenue will remain unchanged." },
          { id: "D", text: "Total revenue will drop to zero." }
        ],
        correctId: "B",
        explanation: "Correct! With inelastic demand, the percentage gain in price per unit outweighs the small percentage loss in units sold, increasing total revenue."
      },
      {
        id: 3,
        conceptTag: "Price Ceilings",
        bloomLevel: "Analysis",
        question: "A binding price ceiling set below the market equilibrium price results in which market condition?",
        options: [
          { id: "A", text: "Persistent market surplus" },
          { id: "B", text: "Persistent market shortage (Excess Demand)" },
          { id: "C", text: "Zero deadweight loss" },
          { id: "D", text: "Immediate price crash" }
        ],
        correctId: "B",
        explanation: "Correct! Setting price below equilibrium increases quantity demanded while decreasing quantity supplied, producing a shortage."
      },
      {
        id: 4,
        conceptTag: "Cross-Price Elasticity",
        bloomLevel: "Knowledge",
        question: "If the cross-price elasticity of demand between Good X and Good Y is negative, Good X and Good Y are:",
        options: [
          { id: "A", text: "Substitute goods" },
          { id: "B", text: "Complementary goods" },
          { id: "C", text: "Inferior goods" },
          { id: "D", text: "Luxury goods" }
        ],
        correctId: "B",
        explanation: "Correct! A negative cross-price elasticity means an increase in the price of Good Y decreases demand for Good X, identifying them as complements."
      },
      {
        id: 5,
        conceptTag: "Consumer Surplus",
        bloomLevel: "Evaluation",
        question: "On a standard supply and demand graph, Consumer Surplus is represented by the area:",
        options: [
          { id: "A", text: "Above the supply curve and below market price" },
          { id: "B", text: "Below the demand curve and above the market price" },
          { id: "C", text: "To the right of the equilibrium point" },
          { id: "D", text: "Below the supply curve" }
        ],
        correctId: "B",
        explanation: "Correct! Consumer surplus is the difference between what consumers are willing to pay and what they actually pay, bounded below the demand curve and above market price."
      }
    ]
  }
];
