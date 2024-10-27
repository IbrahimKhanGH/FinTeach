import React, { useState } from 'react';
import { ExternalLink, BookOpen, Calculator, Building, Users, Library, Heart, FileText, Landmark, Search } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/shared/Card';


const EducationResources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');


  const resources = [
    {
      title: "Texas Retirement System (TRS)",
      description: "Official portal for Texas teacher retirement benefits and information",
      url: "https://www.trs.texas.gov/Pages/Homepage.aspx",
      icon: Landmark,
      category: "Retirement"
    },
    {
      title: "Help Texas Teachers",
     description: "Comprehensive resource hub for Texas educators",
      url: "https://helptxteachers.com/",
      icon: Heart,
      category: "Support"
    },
    {
      title: "Texas Education Agency",
      description: "State education oversight and resources",
      url: "https://tea.texas.gov/",
      icon: Building,
      category: "Official"
    },
    {
      title: "Texas Classroom Teachers Association",
      description: "Professional organization supporting Texas teachers",
      url: "https://tcta.org/",
      icon: Users,
      category: "Professional"
    },
    {
      title: "NEA Member Benefits",
      description: "National Education Association benefits portal",
      url: "https://www.neamb.com/",
      icon: Heart,
      category: "Benefits"
    },
    {
      title: "Texas Retired Teachers Association",
      description: "Supporting retired educators across Texas",
      url: "https://trta.org/",
      icon: Users,
      category: "Retirement"
    },
    {
      title: "Financial Planning Association - Houston",
      description: "Financial planning resources and guidance",
      url: "https://www.fpahouston.org/",
      icon: Calculator,
      category: "Financial"
    },
    {
      title: "Texas AFT Member Benefits",
      description: "American Federation of Teachers Texas benefits",
      url: "https://www.texasaft.org/member-benefits/",
      icon: Heart,
      category: "Benefits"
    },
    {
      title: "Teachers First",
      description: "Educational resources and teaching materials",
      url: "https://www.teachersfirst.com/",
      icon: BookOpen,
      category: "Education"
    },
    {
      title: "Educators First Financial",
      description: "Specialized financial services for educators",
      url: "https://www.educatorsfirstfinancial.com/",
      icon: Calculator,
      category: "Financial"
    },
    {
      title: "TRS Benefit Calculator",
      description: "Calculate your retirement benefits",
      url: "https://www.trs.texas.gov/Pages/benefit_calculator.aspx",
      icon: Calculator,
      category: "Tools"
    },
    {
      title: "TIAA",
      description: "Financial services for the education sector",
      url: "https://www.tiaa.org/public",
      icon: Landmark,
      category: "Financial"
    },
    {
      title: "Texas Association of School Administrators",
      description: "Supporting educational leadership",
      url: "https://www.tasanet.org/",
      icon: Users,
      category: "Professional"
    },
    {
      title: "Texas A&M AgriLife Extension",
      description: "Educational programs and resources",
      url: "https://agrilifeextension.tamu.edu/",
      icon: Library,
      category: "Education"
    },
    {
      title: "Pension Review Board",
      description: "Texas public retirement systems oversight",
      url: "https://www.prb.texas.gov/",
      icon: FileText,
      category: "Official"
    },
    {
      title: "Employee Retirement System of Texas",
      description: "State employee retirement benefits",
      url: "https://www.pers.state.tx.us/",
      icon: Landmark,
      category: "Retirement"
    },
    {
      title: "Texas Teachers",
      description: "Alternative certification program",
      url: "https://www.texasteachers.org/",
      icon: BookOpen,
      category: "Education"
    },
    {
      title: "Texas Foundation for Educational Excellence",
      description: "Supporting educational initiatives",
      url: "https://www.tfee.texas.gov/",
      icon: Heart,
      category: "Support"
    },
    {
      title: "Texas Association of Retired Teachers",
      description: "Community for retired educators",
      url: "https://www.tartx.org/",
      icon: Users,
      category: "Retirement"
    },
    {
      title: "Social Security Administration",
      description: "Federal retirement and disability benefits",
      url: "https://www.ssa.gov/",
      icon: Building,
      category: "Official"
    }
  ];

  const categories = ['All', ...new Set(resources.map(resource => resource.category))];

  const filteredResources = resources.filter(resource => 
    (selectedCategory === 'All' || resource.category === selectedCategory) &&
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Education Resources</h1>
          <p className="text-xl text-gray-600">Comprehensive resources for Texas educators</p>
        </header>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#025742]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#025742] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-all duration-300 hover:scale-105"
              >
                <Card className="h-full bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
             <Icon className="h-6 w-6 text-[#025742]" />
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <CardDescription className="text-gray-600 mt-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#025742] bg-opacity-10 text-[#025742]">
                      {resource.category}
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default EducationResources;
