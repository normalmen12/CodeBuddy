import { useState } from 'react';
import { Code, Zap, Heart, Star, Trophy, Bug, Layers, Palette, FileText, CheckCircle, BarChart3 } from 'lucide-react';

interface Activity {
  id: number;
  type: ActivityType;
  details: ActivityDetails;
  timestamp: string;
  language: string;
}

interface PetStats {
  name: string;
  level: number;
  experience: number;
  energy: number;
  mood: MoodType;
  jsLines: number;
  tsLines: number;
  reactComponents: number;
  tailwindClasses: number;
  hooksUsed: number;
  apiCalls: number;
  testsWritten: number;
  eslintErrors: number;
  codeComplexity: string;
  refactorings: number;
  npmPackages: number;
  todayStats: {
    commits: number;
    bugs: number;
    features: number;
    reviews: number;
  };
}

interface ActivityDetails {
  lines?: number;
  complexity?: 'simple' | 'intermediate' | 'advanced' | 'complex';
  hooks?: number;
  classes?: number;
  tests?: number;
  eslintFix?: boolean;
}

interface SkillThresholds {
  expert: number;
  advanced: number;
  intermediate: number;
}

type ActivityType = 
  | 'code-js' 
  | 'code-ts' 
  | 'react-component' 
  | 'tailwind-styling' 
  | 'api-integration' 
  | 'testing' 
  | 'debugging' 
  | 'refactoring' 
  | 'code-review' 
  | 'learning';

type MoodType = 'excited' | 'happy' | 'focused' | 'determined' | 'proud' | 'tired';

const JSCodingPet = () => {  const [pet, setPet] = useState<PetStats>({
    name: 'JSBuddy',
    level: 1,
    experience: 0,
    energy: 100,
    mood: 'happy',
    // JS/TS specific stats
    jsLines: 0,
    tsLines: 0,
    reactComponents: 0,
    tailwindClasses: 0,
    hooksUsed: 0,
    apiCalls: 0,
    testsWritten: 0,
    eslintErrors: 0,
    codeComplexity: 'simple',
    refactorings: 0,
    npmPackages: 0,
    // Daily tracking
    todayStats: {
      commits: 0,
      bugs: 0,
      features: 0,
      reviews: 0
    }
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Enhanced evolution based on language mastery
  const getPetStage = () => {
    const totalLines = pet.jsLines + pet.tsLines;
    const reactMastery = pet.reactComponents >= 10 && pet.hooksUsed >= 20;
    const tsMastery = pet.tsLines > pet.jsLines * 0.3;
    
    if (pet.level >= 25 && reactMastery && tsMastery) return 'fullstack-master';
    if (pet.level >= 20 && (reactMastery || tsMastery)) return 'senior-dev';
    if (pet.level >= 15 && totalLines > 1000) return 'mid-dev';
    if (pet.level >= 8 && pet.reactComponents > 5) return 'react-dev';
    if (pet.level >= 5) return 'junior-dev';
    return 'beginner';
  };

  const getPetAppearance = () => {
    const stage = getPetStage();
    const appearances = {
      'beginner': { 
        color: 'from-yellow-400 to-orange-400', 
        icon: Code, 
        size: 'w-20 h-20',
        glow: '',
        title: 'Novato JS'
      },
      'junior-dev': { 
        color: 'from-green-400 to-teal-400', 
        icon: FileText, 
        size: 'w-22 h-22',
        glow: '',
        title: 'Junior Developer'
      },
      'react-dev': { 
        color: 'from-blue-400 to-cyan-400', 
        icon: Layers, 
        size: 'w-24 h-24',
        glow: 'shadow-blue-200',
        title: 'React Developer'
      },
      'mid-dev': { 
        color: 'from-purple-400 to-indigo-400', 
        icon: BarChart3, 
        size: 'w-28 h-28',
        glow: 'shadow-purple-200',
        title: 'Mid-Level Dev'
      },
      'senior-dev': { 
        color: 'from-pink-400 to-rose-400', 
        icon: Trophy, 
        size: 'w-32 h-32',
        glow: 'shadow-pink-200',
        title: 'Senior Developer'
      },
      'fullstack-master': { 
        color: 'from-gradient-to-r from-purple-400 via-pink-400 to-red-400', 
        icon: Star, 
        size: 'w-36 h-36',
        glow: 'shadow-xl shadow-purple-300',
        title: 'Full-Stack Master'
      }
    };
    return appearances[stage];
  };
  const addDetailedActivity = (type: ActivityType, details: ActivityDetails = {}) => {
    const timestamp = new Date();
    const newActivity: Activity = {
      id: timestamp.getTime(),
      type,
      details,
      timestamp: timestamp.toLocaleTimeString(),
      language: selectedLanguage
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 6)]);

    setPet(prev => {
      const expGain = calculateExpGain(type, details);
      const newExp = prev.experience + expGain;
      const newLevel = Math.floor(newExp / 150) + 1;
      
      let updates = {
        ...prev,
        experience: newExp,
        level: newLevel,
        energy: Math.min(100, prev.energy + getEnergyGain(type)),
        mood: newLevel > prev.level ? 'excited' : getMoodFromActivity(type)
      };

      // Update specific stats based on activity
      updates = updateSpecificStats(updates, type, details);
      
      return updates;
    });
  };
  const calculateExpGain = (type: ActivityType, details: ActivityDetails): number => {
    const baseExp: Record<ActivityType, number> = {
      'code-js': 12,
      'code-ts': 15,
      'react-component': 25,
      'tailwind-styling': 10,
      'api-integration': 30,
      'testing': 35,
      'debugging': 20,
      'refactoring': 25,
      'code-review': 15,
      'learning': 18
    };

    let exp = baseExp[type] || 10;
    
    // Complexity multiplier
    if (details.complexity === 'complex') exp *= 1.5;
    else if (details.complexity === 'advanced') exp *= 2;
    
    // Lines multiplier
    if (details.lines) exp += Math.floor(details.lines / 10);
    
    return Math.floor(exp);
  };
  const updateSpecificStats = (pet: PetStats, type: ActivityType, details: ActivityDetails): PetStats => {
    const updates = { ...pet };
    
    switch(type) {
      case 'code-js':
        updates.jsLines += details.lines || 20;
        break;
      case 'code-ts':
        updates.tsLines += details.lines || 20;
        break;
      case 'react-component':
        updates.reactComponents += 1;
        if (details.hooks) updates.hooksUsed += details.hooks;
        break;
      case 'tailwind-styling':
        updates.tailwindClasses += details.classes || 10;
        break;
      case 'api-integration':
        updates.apiCalls += 1;
        break;
      case 'testing':
        updates.testsWritten += details.tests || 1;
        break;
      case 'debugging':
        updates.todayStats.bugs += 1;
        if (details.eslintFix) updates.eslintErrors += 1;
        break;
      case 'refactoring':
        updates.refactorings += 1;
        break;
    }
    
    return updates;
  };
  const getEnergyGain = (type: ActivityType): number => {
    const energyMap: Partial<Record<ActivityType, number>> = {
      'testing': 15,
      'debugging': 10,
      'refactoring': 12,
      'learning': 8,
      'code-review': 6
    };
    return energyMap[type] || 5;
  };

  const getMoodFromActivity = (type: ActivityType): MoodType => {
    if (['testing', 'refactoring'].includes(type)) return 'focused';
    if (['debugging'].includes(type)) return 'determined';
    if (['react-component', 'api-integration'].includes(type)) return 'excited';
    return 'happy';
  };

  const getProgressPercentage = () => (pet.experience % 150) / 150 * 100;
  const getMoodEmoji = (): string => {
    const moods: Record<MoodType, string> = {
      'excited': '🤩',
      'happy': '😊',
      'focused': '🤓',
      'determined': '😤',
      'proud': '😌',
      'tired': '😴'
    };
    return moods[pet.mood as MoodType] || '😊';
  };

  const getSkillLevel = (current: number, thresholds: SkillThresholds) => {
    if (current >= thresholds.expert) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (current >= thresholds.advanced) return { level: 'Avanzado', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (current >= thresholds.intermediate) return { level: 'Intermedio', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Principiante', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  const appearance = getPetAppearance();
  const IconComponent = appearance.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {pet.name} {getMoodEmoji()}
        </h1>
        <p className="text-gray-600 text-lg">
          Nivel {pet.level} • {appearance.title}
        </p>
      </div>

      {/* Pet Visual */}
      <div className="flex justify-center mb-8">
        <div className={`${appearance.size} bg-gradient-to-br ${appearance.color} rounded-full flex items-center justify-center shadow-lg ${appearance.glow} transform hover:scale-105 transition-all duration-300`}>
          <IconComponent className="w-16 h-16 text-white" />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">Energía</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${pet.energy}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{pet.energy}/100</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Experiencia</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{pet.experience} XP</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Líneas JS</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{pet.jsLines.toLocaleString()}</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Líneas TS</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{pet.tsLines.toLocaleString()}</span>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            Habilidades React
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Componentes:</span>
              <span className="font-bold text-blue-600">{pet.reactComponents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Hooks Usados:</span>
              <span className="font-bold text-cyan-600">{pet.hooksUsed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nivel React:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getSkillLevel(pet.reactComponents, {expert: 50, advanced: 25, intermediate: 10}).bg} ${getSkillLevel(pet.reactComponents, {expert: 50, advanced: 25, intermediate: 10}).color}`}>
                {getSkillLevel(pet.reactComponents, {expert: 50, advanced: 25, intermediate: 10}).level}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-500" />
            Habilidades Técnicas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Clases Tailwind:</span>
              <span className="font-bold text-pink-600">{pet.tailwindClasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tests Escritos:</span>
              <span className="font-bold text-green-600">{pet.testsWritten}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>APIs Integradas:</span>
              <span className="font-bold text-purple-600">{pet.apiCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Refactorizaciones:</span>
              <span className="font-bold text-orange-600">{pet.refactorings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ¿Qué estás programando hoy?
        </label>
        <select 
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="react">React</option>
          <option value="testing">Testing</option>
        </select>
      </div>

      {/* Detailed Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <button 
          onClick={() => addDetailedActivity('code-js', {lines: 50, complexity: 'simple'})}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Code className="w-4 h-4" />
          Código JS
        </button>
        <button 
          onClick={() => addDetailedActivity('code-ts', {lines: 40, complexity: 'intermediate'})}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Código TS
        </button>
        <button 
          onClick={() => addDetailedActivity('react-component', {hooks: 3, complexity: 'intermediate'})}
          className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Layers className="w-4 h-4" />
          Componente React
        </button>
        <button 
          onClick={() => addDetailedActivity('tailwind-styling', {classes: 15})}
          className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Palette className="w-4 h-4" />
          Estilos Tailwind
        </button>
        <button 
          onClick={() => addDetailedActivity('testing', {tests: 3, complexity: 'advanced'})}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Escribí Tests
        </button>
        <button 
          onClick={() => addDetailedActivity('debugging', {eslintFix: true})}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Bug className="w-4 h-4" />
          Arreglé Bug
        </button>
      </div>

      {/* Recent Activity */}
      {activities.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">
                    {getDetailedActivityText(activity.type, activity.details)}
                  </span>
                  <div className="text-sm text-gray-500">
                    {activity.language} • +{calculateExpGain(activity.type, activity.details)} XP
                  </div>
                </div>
                <span className="text-sm text-gray-400">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pet Message */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-400">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-1">
              {pet.name} dice:
            </p>
            <p className="text-gray-600 italic">
              {getPersonalizedMessage()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  function getDetailedActivityText(type: ActivityType, details: ActivityDetails): string {
    const texts: Record<ActivityType, string> = {
      'code-js': `Escribiste ${details.lines || 20} líneas de JavaScript`,
      'code-ts': `Escribiste ${details.lines || 20} líneas de TypeScript`,
      'react-component': `Creaste un componente React${details.hooks ? ` con ${details.hooks} hooks` : ''}`,
      'tailwind-styling': `Aplicaste ${details.classes || 10} clases de Tailwind`,
      'api-integration': 'Integraste una API',
      'testing': `Escribiste ${details.tests || 1} test${details.tests && details.tests > 1 ? 's' : ''}`,
      'debugging': 'Arreglaste un bug',
      'refactoring': 'Refactorizaste código',
      'code-review': 'Revisaste código',
      'learning': 'Aprendiste algo nuevo'
    };
    return texts[type] || 'Actividad de programación';
  }

  function getPersonalizedMessage() {
    const stage = getPetStage();
    const jsTs = pet.jsLines + pet.tsLines;
    const reactLevel = getSkillLevel(pet.reactComponents, {expert: 50, advanced: 25, intermediate: 10});
    
    if (stage === 'fullstack-master') {
      return "¡Increíble! Eres un verdadero maestro del stack JavaScript. Tu dominio de JS, TS y React me inspira cada día. ¡Sigamos construyendo cosas increíbles juntos!";
    } else if (stage === 'senior-dev') {
      return `¡Wow! Ya tienes ${jsTs.toLocaleString()} líneas de código y tu nivel React es ${reactLevel.level}. Estás en camino a convertirte en un experto total del ecosistema JS.`;
    } else if (stage === 'react-dev') {
      return `¡Me encanta ver cómo dominas React! Ya tienes ${pet.reactComponents} componentes creados. ¿Qué tal si exploramos algunos hooks más avanzados?`;
    } else if (pet.tsLines > pet.jsLines) {
      return "¡Veo que prefieres TypeScript! Excelente elección para código más robusto. Tu mascota está evolucionando hacia un perfil más senior.";
    } else {
      return `¡Sigue así! Ya llevas ${pet.jsLines.toLocaleString()} líneas de JavaScript. Cada línea de código me hace más inteligente y fuerte.`;
    }
  }
};

export default JSCodingPet;